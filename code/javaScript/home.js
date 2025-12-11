function serchFunction() {
  const searchBox = document.querySelector(".search_box");
  const resultsContainer = document.querySelector(".results_container");

  if (searchBox.style.display === "inline") {
    searchBox.style.display = "none";
    resultsContainer.style.display = "none";
  } else {
    searchBox.style.display = "inline";
    resultsContainer.style.display = "flex";
  }
}

const input = document.getElementById("search_box");
input.addEventListener("input", (e) => {
  console.log(e.target.value);
});

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('cardsWrapper');
  const scrollLeftBtn = document.getElementById('scrollLeftBtn');
  const scrollRightBtn = document.getElementById('scrollRightBtn');
  const scrollDistance = 195;

  const scrollCards = (direction) => {
    wrapper.scrollTo({
      left: wrapper.scrollLeft + (direction * scrollDistance),
      behavior: 'smooth'
    });
  };

  scrollLeftBtn.addEventListener('click', () => scrollCards(-1));
  scrollRightBtn.addEventListener('click', () => scrollCards(1));
});

const apiKey = "6802086343806005e8c57c443f7d07ca";
let latitude, longitude;
let city, country, description;
let temp, temp_max, temp_min, wind, humidity;

const icons = [
  { name: "Clouds", url: "/icons/cloud-sun-2-svgrepo-com.svg" },
  { name: "Rain", url: "/icons/cloud-rain-svgrepo-com.svg" },
  { name: "Clear", url: "/icons/sun-svgrepo-com.svg" },
  { name: "Snow", url: "/icons/snow-crystal-2-svgrepo-com.svg" }
];

function getIcon(description) {
  const desc = description.toLowerCase();
  if (desc.includes("cloud")) return icons.find(i => i.name === "Clouds").url;
  if (desc.includes("rain")) return icons.find(i => i.name === "Rain").url;
  if (desc.includes("snow")) return icons.find(i => i.name === "Snow").url;
  return icons.find(i => i.name === "Clear").url;
}

function getCountryName(code) {
  return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
}

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        resolve({ latitude, longitude });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather data");
  return await res.json();
}

async function getWeather(lat, lon) {
  const data = await fetchData(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );

  city = data.name;
  country = data.sys.country;
  description = data.weather[0].main;

  temp = data.main.temp;
  temp_max = data.main.temp_max;
  temp_min = data.main.temp_min;
  wind = data.wind.speed;
  humidity = data.main.humidity;
  console.log(data);
}




// Function to get current weather by city name
async function getBycityWeather(cityName) {
  try {
    const data = await fetchData(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    );

    return {
      city: data.name,
      temp: Math.round(data.main.temp),
      description: data.weather[0].main
    };
  } catch (error) {
    console.error(`Error fetching weather for ${cityName}:`, error);
    return null;
  }
}

// Function to update all city cards
async function updateCityCards() {
  const cityCards = document.querySelectorAll(".city-card");

  for (const card of cityCards) {
    const cityName = card.querySelector(".day-name").textContent.trim();
    const weather = await getBycityWeather(cityName);

    if (weather) {
      const tempEl = card.querySelector(".temp");
      const conditionEl = card.querySelector(".condition");
      const iconEl = card.querySelector(".card-icon");

      tempEl.textContent = `${weather.temp} °C`;
      conditionEl.textContent = weather.description;

      // Update icon based on weather description
      const iconSrc = getIcon(weather.description);

      iconEl.src = iconSrc;
      iconEl.alt = weather.description;
    }
  }
}

// Call the function to update all cards




function updates_city_card() {
  document.querySelector('.city-name').innerText = city;
  document.querySelector('.country-name').innerText = getCountryName(country);
  document.querySelector('.current-temp').innerText = `${Math.round(temp)}°C`;

  document.querySelector('.large-icon').src = getIcon(description);

  document.querySelector('.temp-max').innerText = `↑ ${temp_max}°`;
  document.querySelector('.temp-min').innerText = `↓ ${temp_min}°`;
  document.querySelector('.wind').innerText = `⚑ ${wind} km/h`;
  document.querySelector('.humidity').innerText = `💧 ${humidity}%`;
}

async function getForecast(lat, lon) {
  try {
    const data = await fetchData(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const dailyData = {};

    data.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          weather: item.weather[0].description
        };
      } else {
        dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
        dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
      }
    });

    const forecastArray = Object.keys(dailyData)
      .slice(0, 5)
      .map(date => ({
        date,
        temp_min: dailyData[date].temp_min,
        temp_max: dailyData[date].temp_max,
        weather: dailyData[date].weather
      }));

    console.log("Next 5 days forecast:", forecastArray);
    return forecastArray;

  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}

function updateWeatherCards(forecastArray) {
  const cardsWrapper = document.getElementById("cardsWrapper");

  // Clear existing cards
  cardsWrapper.innerHTML = "";

  forecastArray.forEach(day => {
    const card = document.createElement("div");
    card.classList.add("weather_day_card");

    const dateObj = new Date(day.date);
    const options = { weekday: "long", day: "2-digit", month: "short" };
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const formattedDate = dateObj.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

    const iconSrc = getIcon(day.weather);

    card.innerHTML = `
      <h3 class="day-name">${dayName}</h3>
      <p class="date">${formattedDate}</p>
      <img src="${iconSrc}" alt="${day.weather}" class="day-icon">
      <span class="temp">${Math.round(day.temp_max)} °C</span>
      <p class="condition">${day.weather}</p>
    `;

    cardsWrapper.appendChild(card);
  });
}


async function initWeather() {
  try {
    const { latitude, longitude } = await getLocation();
    await getWeather(latitude, longitude);
    const forecastArray = await getForecast(latitude, longitude)
    updates_city_card();
    updateWeatherCards(forecastArray);
    await updateCityCards();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

initWeather();
