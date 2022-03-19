function changeDate() {
  let now = new Date();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let date = now.getDate();
  let year = now.getFullYear();

  let hour = now.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let min = now.getMinutes();
  if (min < 10) {
    min = `0${min}`;
  }

  let time = `${hour}:${min}`;

  let todayDate = document.querySelector("#today-date");

  todayDate.innerHTML = `${day}, ${month} ${date}, ${year} | ${time}`;
}

changeDate();

// change forecast
function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");

  let days = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
        <div class="col-2">
        <div class="weather-forecast-date">${day}</div>
        <img
          src="http://openweathermap.org/img/wn/50d@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> 18° </span>
          <span class="weather-forecast-temperature-min"> 12° </span>
        </div>
      </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// get coordinated for forecast
function getForecast(coordinates) {
  let apiKey = "fc4cce9256dbfa5057522b9ccaf07872";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

// changing Heading and Temp
function changeHtml(response) {
  let temperatureElement = document.querySelector("#today-temp");
  let cityElement = document.querySelector("#city-header");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#main-icon");

  farenheitTemp = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(farenheitTemp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

// Searching the City
function citySearch(city) {
  let apiKey = "fc4cce9256dbfa5057522b9ccaf07872";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(changeHtml);
}

function formSubmission(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  citySearch(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", formSubmission);

// Getting your Current Location
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "imperial";
  let apiKey = "fc4cce9256dbfa5057522b9ccaf07872";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(changeHtml);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getCurrentPosition);

// changing F to C buttons
function displayCelcius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#today-temp");
  fahrenheitLink.classList.remove("active");
  celciusLink.classList.add("active");
  let celciusTemp = ((farenheitTemp - 32) * 5) / 9;
  tempElement.innerHTML = Math.round(celciusTemp);
  document.querySelector("#degreeUnit").innerHTML = "C";
}

function displayFahrenheit(event) {
  event.preventDefault();
  fahrenheitLink.classList.add("active");
  celciusLink.classList.remove("active");
  let tempElement = document.querySelector("#today-temp");
  tempElement.innerHTML = Math.round(farenheitTemp);
  document.querySelector("#degreeUnit").innerHTML = "F";
}

let farenheitTemp = null;

//let tempElement = document.querySelector("today-temp");

let celciusLink = document.querySelector("#celsius-link");
celciusLink.addEventListener("click", displayCelcius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);

// search
citySearch("Minneapolis");
