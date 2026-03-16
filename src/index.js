function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDay();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return `${days[day]} ${hours}:${minutes}`;
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#current-description");
  let humidityElement = document.querySelector("#current-humidity");
  let windElement = document.querySelector("#current-wind");
  let feelsLikeElement = document.querySelector("#current-feels-like");
  let iconElement = document.querySelector(".current-temperature-icon");

  let temperature = Math.round(response.data.temperature.current);
  let feelsLike = Math.round(response.data.temperature.feels_like);

  cityElement.innerHTML = response.data.city;
  temperatureElement.innerHTML = temperature;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  feelsLikeElement.innerHTML = `${feelsLike}°C`;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" alt="${response.data.condition.description}" style="width:48px;height:48px;" />`;
}

function displayForecast(response) {
  let forecastRow = document.querySelector("#forecast-row");
  let forecastSection = document.querySelector("#forecast-section");
  let forecast = response.data.daily;

  forecastRow.innerHTML = "";

  // SheCodes forecast returns an array of daily entries; skip index 0 (today), take next 5
  forecast.slice(1, 6).forEach(function (day) {
    let date = new Date(day.time * 1000);
    let dayName = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    let high = Math.round(day.temperature.maximum);
    let low = Math.round(day.temperature.minimum);
    let iconUrl = day.condition.icon_url;
    let description = day.condition.description;

    forecastRow.innerHTML += `
      <div class="forecast-day">
        <span class="forecast-day-name">${dayName}</span>
        <img class="forecast-icon" src="${iconUrl}" alt="${description}" />
        <div class="forecast-temps">
          <span class="forecast-high">${high}°</span>
          <span class="forecast-low">${low}°</span>
        </div>
      </div>`;
  });

  forecastSection.classList.add("visible");
}

function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  let city = searchInputElement.value;

  let apiKey = "b2a5adcct04b33178913oc335f405433";

  let currentApiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(currentApiUrl).then(displayTemperature);

  let forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(forecastApiUrl).then(displayForecast);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let currentDateElement = document.querySelector("#current-date");
let currentDate = new Date();
currentDateElement.innerHTML = formatDate(currentDate);
