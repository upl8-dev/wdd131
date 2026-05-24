const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");
const windChill = document.querySelector("#wind-chill");

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = document.lastModified;

const temperature = 27;
const windSpeed = 2;

function calculateWindChill(temperature, windSpeed) {
  return 13.12 + (0.6215 * temperature) - (11.37 * Math.pow(windSpeed, 0.16)) + (0.3965 * temperature * Math.pow(windSpeed, 0.16));
}

if (temperature <= 10 && windSpeed > 4.8) {
  windChill.textContent = `${calculateWindChill(temperature, windSpeed).toFixed(1)}°C`;
} else {
  windChill.textContent = "N/A";
}