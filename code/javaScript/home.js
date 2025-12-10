function serchFunction() {
  if (document.querySelector(".search_box").style.display == "inline") {
    document.querySelector(".search_box").style.display = "none";
    document.querySelector(".results_container").style.display = "none";
  } else {
    document.querySelector(".search_box").style.display = "inline";
    document.querySelector(".results_container").style.display = "flex";
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
        const newScrollLeft = wrapper.scrollLeft + (direction * scrollDistance);
        
        wrapper.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };
    scrollLeftBtn.addEventListener('click', () => {
        scrollCards(-1); 
    });
    scrollRightBtn.addEventListener('click', () => {
        scrollCards(1); 
    });
});

let apiKey = "6802086343806005e8c57c443f7d07ca";
let latitude;
let longitude;
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      getWeather(latitude, longitude);
    },
    (error) => {
      console.error("Error getting location:", error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

async function getWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await res.json();
    console.log("City:", data.name);
    console.log("Temperature:", data.main.temp + "°C");
    console.log("Weather:", data.weather[0].description);
  } catch (err) {
    console.log("API Error:", err.message);
  }
}

getLocation();
