const apiKey = "6802086343806005e8c57c443f7d07ca";

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

async function fetchData(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather data");
    return await res.json();
}

function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => reject(error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    });
}


function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.src = isDark ? '/icons/moon-svgrepo-com.svg' : '/icons/sun-svgrepo-com.svg';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }
});
