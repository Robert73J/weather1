// Load API key from .env securely
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org";

// Optional: warn if key is missing
if (!API_KEY) {
  console.error("❌ Missing OpenWeather API Key — add it to .env");
}

// Geocode city name -> get coordinates (direct)
export async function geocodeCity(city, limit = 1) {
  try {
    const res = await fetch(`${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=${limit}&appid=${API_KEY}`);
    if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error in geocodeCity:", err);
    throw err;
  }
}

// Reverse geocode lat/lon -> place (new helper)
export async function reverseGeocode(lat, lon, limit = 1) {
  try {
    const res = await fetch(`${BASE_URL}/geo/1.0/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&limit=${limit}&appid=${API_KEY}`);
    if (!res.ok) throw new Error(`Reverse geocode failed (${res.status})`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error in reverseGeocode:", err);
    throw err;
  }
}

// Get current weather using coordinates
export async function getCurrentWeatherByCoords(lat, lon, units = "metric") {
  try {
    const res = await fetch(`${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
    if (!res.ok) throw new Error(`Weather fetch failed (${res.status})`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error in getCurrentWeatherByCoords:", err);
    throw err;
  }
}

// Get 5-day / 3-hour forecast using coordinates
export async function get5DayForecast(lat, lon, units = "metric") {
  try {
    const res = await fetch(`${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
    if (!res.ok) throw new Error(`Forecast fetch failed (${res.status})`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error in get5DayForecast:", err);
    throw err;
  }
}
