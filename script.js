const apiKey = 'b3a9c38113cd0c5cc04bb7aa8eaddaf4';

// Display today's date
function displayCurrentDate() {
    const dateDiv = document.getElementById('todays-date');
    if (!dateDiv) return;

    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dateNum = now.getDate();

    dateDiv.textContent = `${dayName}, ${monthName} ${dateNum}`;
}

// Format a timestamp (UTC) + timezone offset in 12-hour format
function formatHour12(timestampSeconds, timezoneOffsetSeconds) {
    const localTimestamp = (timestampSeconds + timezoneOffsetSeconds) * 1000;
    const date = new Date(localTimestamp);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

// Show weather icon
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}

// Display current weather
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    document.getElementById("feels-like").textContent = Math.round(data.main.feels_like);
    document.getElementById("humidity").textContent = `${data.main.humidity}`;
    document.getElementById("wind").textContent = `${Math.round(data.wind.speed)}`;
    document.getElementById("visibility").textContent = `${(data.visibility / 1609).toFixed(1)}`;

    // Sunrise & Sunset in 12-hour format
    document.getElementById("sunrise").textContent = formatHour12(data.sys.sunrise, data.timezone);
    document.getElementById("sunset").textContent = formatHour12(data.sys.sunset, data.timezone);

    tempDivInfo.innerHTML = '';
    weatherInfoDiv.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    tempDivInfo.innerHTML = `<p>${temperature}°F</p>`;
    weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();

    document.getElementById("extra-info").style.display = 'grid';
}

// Display hourly forecast
function displayHourlyForecast(hourlyData, timezoneOffsetSeconds, sunriseUnix, sunsetUnix) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    if (!hourlyData || hourlyData.length === 0) {
        hourlyForecastDiv.style.display = 'none';
        return;
    }

    hourlyForecastDiv.style.display = 'flex';
    hourlyForecastDiv.innerHTML = '';

    // Take the next 8 forecast blocks (3-hour intervals)
    const next8Hours = hourlyData.slice(0, 8);

    // Helper: 12-hour format
    function formatHour12(timestampSeconds) {
        const localTimestamp = (timestampSeconds + timezoneOffsetSeconds) * 1000;
        const date = new Date(localTimestamp);
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    next8Hours.forEach(item => {
        const localForecast = item.dt + timezoneOffsetSeconds;
        const localSunrise = sunriseUnix + timezoneOffsetSeconds;
        const localSunset = sunsetUnix + timezoneOffsetSeconds;

        // Determine if it's night for this forecast
        const isNight = localForecast < localSunrise || localForecast > localSunset;

        // Start with the API icon code
        let iconCode = item.weather[0].icon;

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // Temperature and time
        const temperature = Math.round(item.main.temp);
        const hourText = formatHour12(item.dt);

        // Build HTML
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hourText}</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°F</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}


// Get weather by city
function getWeather() {
    const city = document.getElementById('city').value.trim();
    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);

            fetch(forecastUrl)
                .then(resp => resp.json())
                .then(forecastData => {
                    displayHourlyForecast(
                        forecastData.list,
                        data.timezone,
                        data.sys.sunrise,
                        data.sys.sunset
                    );
                });
        })
        .catch(() => alert('Error fetching weather data.'));
}

// Get weather by coordinates
function getWeatherByCoords(lat, lon) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);

            fetch(forecastUrl)
                .then(resp => resp.json())
                .then(forecastData => {
                    displayHourlyForecast(
                        forecastData.list,
                        data.timezone,
                        data.sys.sunrise,
                        data.sys.sunset
                    );
                });
        })
        .catch(() => alert('Error fetching weather data.'));
}

// Current location button
document.getElementById('current-location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeatherByCoords(position.coords.latitude, position.coords.longitude);
        }, () => alert('Unable to get your location.'));
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Display the date on page load
window.addEventListener('DOMContentLoaded', displayCurrentDate);
