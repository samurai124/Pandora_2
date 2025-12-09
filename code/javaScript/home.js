let apiKey = "232d0db3036cadd3faf87eca64b548ea";
const cities = ["Paris", "Tokyo", "Madrid"];
const city = "Paris";


if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      console.log("Latitude:", lat);
      console.log("Longitude:", lon);

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await res.json();

        console.log("City:", data.name);
        console.log("Temp:", data.main.temp);
        console.log("Weather:", data.weather[0].description);

      } catch (err) {
        console.log("API Error:", err.message);
      }
    },
    (error) => {
      console.log("Location Error:", error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}
