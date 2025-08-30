# Simple Weather App
## By: Marilyn Gable
### Description: 

This project is a web-based weather application built using HTML, CSS, and JavaScript. Its primary goal is to give users fast and reliable access to current weather conditions and forecasts in a clean, easy-to-use interface. By connecting to the OpenWeather API, the app provides real-time weather data based on either the user’s current location or a city input of their choice, making it functional anywhere in the world.
The app goes beyond showing just the current temperature by delivering a detailed 24-hour forecast, broken down into three-hour intervals. Along with temperature and conditions, it also displays useful information such as the “feels like” temperature, humidity, wind speed, visibility, and sunrise/sunset times. To improve readability and user experience, the app integrates dynamic weather icons provided by OpenWeather, which adjust not only to reflect current conditions but also switch between daytime and nighttime versions.

In terms of design, the project emphasizes clarity and accessibility. The interface is styled with responsive CSS, ensuring the app looks sleek and functions smoothly across both desktop and mobile devices. The layout is intentionally simple, allowing users to quickly scan for the information they need without distraction.

#### The project consists of three main files:

index.html – This file contains the structure and content of the web app. It uses div containers to hold all of the fetched API content for the user, as well as the input areas for the user. 

style.css – This file is responsible for the app’s visual presentation. It includes styles for layout, typography, colors, spacing, and responsive design. The interface uses a sleek, minimalist aesthetic with icons provided by OpenWeather to make the app visually appealing. Media queries were used to ensure the app functions seamlessly on both desktop and mobile screens. This focus on responsive design was intentional, as I wanted the app to be fully usable on phones and computers without sacrificing readability.

script.js – This file contains the core JavaScript functionality for the app. It handles API requests, retrieves and parses weather data from OpenWeather, and updates the DOM to display this data dynamically. The script also manages user interactions, such as city searches and geolocation requests. One design consideration here was how to structure the API calls efficiently while keeping the code readable. I opted for modular functions that separate concerns—fetching data, updating the interface, and handling user input—so that each part of the code is easier to maintain and understand. Error handling was also included to provide feedback when a city is not found or if location access is denied.

This project demonstrates practical skills in API integration, JavaScript-driven interactivity, and responsive design. It showcases how web technologies can be combined to deliver a useful tool with both functionality and aesthetic appeal.
