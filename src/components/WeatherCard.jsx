// WeatherCard.jsx
import React from "react";
import { getWeatherIcon, iconColor } from "../utils/helpers";
export default function WeatherCard({ weather, units, query, isDark }) {
  if (!weather) return null;

  const Icon = getWeatherIcon(
  weather?.weather?.[0]?.main,
  weather?.weather?.[0]?.description,
  weather?.weather?.[0]?.icon
);

const color = iconColor(weather?.weather?.[0]?.description);

  return (
    <div className={`weather-card ${isDark ? "dark" : "light"}`}>
      <div className="header">
        <h2>{query}</h2>
      </div>

      <div className="main-info">
        <Icon className="weather-icon" color={color} size={60} />

        <div className="temp-block">
          <div className="temp">
  {Math.round(weather.main?.temp)}°{units === "metric" ? "C" : "F"}
          </div>
          <div className="feels-like">
            Feels like: {Math.round(weather.main?.feels_like)}°
            {units === "metric" ? "C" : "F"}
          </div>
        </div>
      </div>

      <div className="desc">
  {weather?.weather?.[0]?.description}
</div>
    </div>
  );
}
