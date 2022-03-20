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

// formating dt to actual day of week
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

// change forecast
function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index != 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// get coordinates for forecast
function getForecast(coordinates) {
  let apiKey = "fc4cce9256dbfa5057522b9ccaf07872";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

// get Condition to change the background
function changeBackground(response) {
  let conditionId = response.data.weather[0].id;
  let boxColor = document.querySelector("#box-color");
  //let sunset = response.data.sys.sunset;
  //let sunsetTime = new Date(sunset * 1000);
  //console.log(sunsetTime);
  console.log(conditionId);
  if (conditionId === 800 || conditionId <= 802) {
    boxColor.classList.add("sunny");
  } else {
    boxColor.classList.add("cloudy");
  }
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
  axios.get(apiUrl).then(changeBackground);
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
  axios.get(apiUrl).then(changeBackground);
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
