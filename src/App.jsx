import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
import {
  geocodeCity,
  reverseGeocode,
  getCurrentWeatherByCoords,
  get5DayForecast,
} from "./services/weatherService";
import { normalizeBackgroundKey, groupForecastToDays } from "./utils/helpers";
import { useLocalCache } from "./hooks/useLocalCache";
import "./App.css";

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecastDays, setForecastDays] = useState([]);
  const [units, setUnits] = useState("metric");
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getCache, setCache } = useLocalCache("last-weather", 60 * 60 * 2); // 2 hours

  // Map weather conditions to background class
  const weatherBackgroundMap = {
  clear: "clear",
  clouds: "clouds",
  rain: "rain",
  drizzle: "drizzle",
  thunderstorm: "thunderstorm",
  snow: "snow",
  mist: "mist",
  smoke: "smoke",
  haze: "haze",
  dust: "dust",
  fog: "fog",
  sand: "sand",
  ash: "ash",
  squall: "squall",
  tornado: "tornado",

  // description variants
  "few-clouds": "few-clouds",
  "scattered-clouds": "scattered-clouds",
  "broken-clouds": "broken-clouds",
  "overcast-clouds": "overcast-clouds",

  "light-rain": "light-rain",
  "moderate-rain": "moderate-rain",
  "heavy-rain": "heavy-rain",
  "shower-rain": "shower-rain",

  "light-snow": "light-snow",
  "heavy-snow": "heavy-snow",
  "snow-showers": "snow-showers",

  "thunderstorm-with-light-rain": "thunderstorm-with-light-rain",
  "thunderstorm-with-heavy-rain": "thunderstorm-with-heavy-rain",

  // fallback
  default: "default",
};
   

  // 🌤️ Load cached data
  useEffect(() => {
    const cached = getCache();
    if (cached) {
      setSelectedPlace(cached.selectedPlace);
      setWeather(cached.weather);
      setForecastDays(cached.forecastDays || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔍 Handle search selection or unit change
  useEffect(() => {
    async function fetchWeather() {
      if (!selectedPlace || !selectedPlace.lat || !selectedPlace.lon) return;
      setLoading(true);
      setError(null);
      try {
        const [wData, fData] = await Promise.all([
          getCurrentWeatherByCoords(selectedPlace.lat, selectedPlace.lon, units),
          get5DayForecast(selectedPlace.lat, selectedPlace.lon, units),
        ]);
        setWeather(wData);
        const grouped = groupForecastToDays(fData.list || fData);
        setForecastDays(grouped);
        setCache({ selectedPlace, weather: wData, forecastDays: grouped });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [selectedPlace, units, setCache]);

  // compute background class (use main then description)
  const main = weather?.weather?.[0]?.main || "";
const desc = weather?.weather?.[0]?.description || "";

const key = normalizeBackgroundKey(desc) || normalizeBackgroundKey(main);
const backgroundClass = weatherBackgroundMap[key] || "default";

  // 🌍 Detect user’s location automatically on first load (improved reverse geocode)
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation not supported by this device/browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          // Use proper reverse geocode endpoint
          const res = await reverseGeocode(lat, lon, 1);
          let place;
          if (res && Array.isArray(res) && res[0]) {
            place = { name: `${res[0].name}${res[0].state ? ", " + res[0].state : ""}${res[0].country ? ", " + res[0].country : ""}`, lat, lon };
          } else {
            place = { name: "Current Location", lat, lon }; // fallback
          }
          setSelectedPlace(place);
        } catch (err) {
          console.error("Failed to get current location weather:", err);
          // fallback to coords-only place so fetchWeather can still run
          setSelectedPlace({ name: "Current Location", lat, lon });
        }
      },
      (err) => {
        console.warn("User denied geolocation or unavailable:", err);
      }
    );
    // we only want this on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`app ${isDark ? "dark" : "light"} ${backgroundClass}`}>
      <header className="app-header">
        <h1 className="top-heading">Professional Weather</h1>
      </header>

        <div className="theme-toggle">
          <button onClick={() => setIsDark((s) => !s)}>
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button onClick={() => setUnits((prev) => (prev === "metric" ? "imperial" : "metric"))}>
            {units === "metric" ? "°C" : "°F"}
          </button>
        </div>

      <SearchBar onSelect={setSelectedPlace} />

{error && (
  <div className="status-text error search-error">
    {error}
  </div>
)}

<div className="content-scroll">
  {loading && <div className="status-text">Loading…</div>}

        {!loading && weather && (
          <>
            <WeatherCard weather={weather} units={units} query={selectedPlace?.name} isDark={isDark} />
            <ForecastList forecastDays={forecastDays} units={units} isDark={isDark} />
          </>
        )}

        {!loading && !weather && (
          <div className="status-text no-weather">Enter a city to view weather details</div>
        )}
      </div>
    </div>
  );
}
