const params = new URLSearchParams(window.location.search);
const city = params.get("city");

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

    if (scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => scrollCards(-1));
        scrollRightBtn.addEventListener('click', () => scrollCards(1));
    }
});

if (city) {
    loadCityWeather(city);
} else {
    showError();
}

async function loadCityWeather(cityName) {
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
        const weatherData = await fetchData(weatherUrl);

        updateMainCard(weatherData);

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&units=metric&appid=${apiKey}`;
        const forecastData = await fetchData(forecastUrl);

        updateForecast(forecastData);

        document.getElementById('main-weather-section').style.display = 'block';
        document.getElementById('forecast-section').style.display = 'block';

    } catch (error) {
        console.error(error);
        showError();
    }
}

function updateMainCard(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('country-name').textContent = getCountryName(data.sys.country);
    document.getElementById('weather-icon').src = getIcon(data.weather[0].description);

    document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}°`;
    document.getElementById('temp-max').textContent = `↑ ${Math.round(data.main.temp_max)}°`;
    document.getElementById('temp-min').textContent = `↓ ${Math.round(data.main.temp_min)}°`;
    document.getElementById('wind').textContent = `⚑ ${data.wind.speed} km/h`;
    document.getElementById('humidity').textContent = `💧 ${data.main.humidity}%`;
}

function updateForecast(data) {
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

    const cardsWrapper = document.getElementById("cardsWrapper");
    cardsWrapper.innerHTML = "";

    forecastArray.forEach(day => {
        const dateObj = new Date(day.date);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
        const formattedDate = dateObj.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
        const iconSrc = getIcon(day.weather);

        const card = document.createElement("div");
        card.classList.add("weather_day_card");
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

function showError() {
    document.getElementById('error-section').style.display = 'block';
    document.getElementById('main-weather-section').style.display = 'none';
    document.getElementById('forecast-section').style.display = 'none';
}