// src/components/ForecastList.jsx

import React from "react";
import { getWeatherIcon } from "../utils/helpers";

/*
 * Expects forecastDays = [
 *   { day: '2025-11-15' OR 'Mon', tempMin: 20, tempMax: 28, icon: '10d', description: 'light rain' }, ...
 * ]
 */
export default function ForecastList({ forecastDays = [], units = "metric", isDark = false }) {
  if (!forecastDays || forecastDays.length === 0) return null;

  // helper: safe day name (accepts either ISO date string or already short day)
  function getDayName(value) {
    // if value already short like 'Mon' return as-is
    if (typeof value === "string" && value.length <= 3) return value;
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { weekday: "short" });
  }

  // Full 40-condition color system
  function iconColor(description = "") {
    const d = (description || "").toLowerCase();

    // ☀️ Clear (Day & Night)
    if (d.includes("clear") || d === "clear sky") return "#facc15";       // golden sun

    // 🌤️ Clouds (light)
    if (d.includes("few clouds") || d.includes("scattered clouds")) return "#9ca3af";  

    // ☁️ Clouds (medium)
    if (d.includes("broken clouds")) return "#6b7280";

    // 🌫️ Heavy Clouds & Overcast
    if (d.includes("overcast")) return "#4b5563";

    // 🌧️ Drizzle
    if (d.includes("drizzle")) return "#38bdf8";

    // 🌦️ Light Rain
    if (d.includes("light rain")) return "#60a5fa";

    // 🌧️ Moderate Rain
    if (d.includes("moderate rain")) return "#3b82f6";

    // 🌧️ Heavy / Extreme Rain
    if (d.includes("heavy rain") || d.includes("very heavy") || d.includes("extreme rain"))
      return "#1d4ed8";

    // 🌧️ Showers
    if (d.includes("shower")) return "#2563eb";

    // 🌨️ Snow (light)
    if (d === "snow" || d.includes("light snow")) return "#bfdbfe";

    // ❄️ Heavy Snow
    if (d.includes("heavy snow")) return "#93c5fd";

    // 🧊 Sleet
    if (d.includes("sleet")) return "#a5b4fc";

    // 🌨️ Rain & Snow
    if (d.includes("rain and snow")) return "#818cf8";

    // ⚡ Thunderstorm
    if (d.includes("thunder")) return "#7dd3fc";

    // 🌫️ Fog / Mist
    if (d.includes("fog") || d.includes("mist")) return "#cbd5e1";

    // 💨 Smoke
    if (d.includes("smoke")) return "#94a3b8";

    // 🌁 Haze
    if (d.includes("haze")) return "#fbbf24";

    // 🌪️ Dust / Sand / Ash
    if (d.includes("dust")) return "#eab308";
    if (d.includes("sand")) return "#ca8a04";
    if (d.includes("ash")) return "#a16207";

    // 💨 Squall / Strong Wind
    if (d.includes("squall")) return "#60a5fa";

    // 🌪️ Tornado
    if (d.includes("tornado")) return "#7f1d1d";

    // Default neutral cloud color
    return "#94a3b8";
  }

  return (
    <section className="forecast-section" aria-label="5 day forecast">
      <h3 className="forecast-title">5-Day Forecast</h3>

      <div className="forecast-list" role="list">
        {forecastDays.map((dayObj, i) => {
          // Accept different shapes: dayObj.day OR dayObj.date
          const dateKey = dayObj.day || dayObj.date || dayObj.dayName || "";
          const tempMin = dayObj.minTemp ?? 0;
          const tempMax = dayObj.maxTemp ?? 0;
          const temp = dayObj.temp ?? 0;
          const description = dayObj.description || (dayObj.weather && dayObj.weather[0] && dayObj.weather[0].description) || "";
          const iconCode = dayObj.icon || (dayObj.weather && dayObj.weather[0] && dayObj.weather[0].icon) || "";

          // get icon component (returns a component/function from helpers)
          const IconComp =
  getWeatherIcon(
    dayObj.condition || description || "",
    description,
    iconCode
  ) || getWeatherIcon("Clouds", "clouds", "01d");

          const color = iconColor(description);

          return (
            <article
              role="listitem"
              key={i}
              className={`forecast-card ${isDark ? "dark" : "light"}`}
              title={`${getDayName(dateKey)} — ${description}`}
            >
              <div className="forecast-date" aria-hidden="true">{getDayName(dateKey)}</div>

              <div className="forecast-icon" aria-hidden="true">
                {/* IconComp is a component (not JSX) from helpers — render with props */}
                <IconComp size={40} color={color} />
              </div>

              <div className="forecast-desc" style={{ textTransform: "capitalize" }}>
                {description || "—"}
              </div>

              <div className="forecast-temp" aria-label={`High ${Math.round(tempMax || 0)} low ${Math.round(tempMin || 0)}`}>
                <strong>{Math.round(tempMax ?? 0)}°</strong> / <span>{Math.round(tempMin ?? 0)}°</span>
                <span style={{ marginLeft: 6 }}>{units === "metric" ? "C" : "F"}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
