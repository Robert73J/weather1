// helpers.js
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiCloudyWindy,
  WiFog,
  WiSmoke,
  WiDayHaze,
  WiDust,
  WiSandstorm,
  WiVolcano,
  WiShowers,
  WiSprinkle,
  WiRain,
  WiRainMix,
  WiSleet,
  WiSnow,
  WiSnowflakeCold,
  WiHail,
  WiThunderstorm,
  WiTornado,
  WiStrongWind,
} from "react-icons/wi";

export function getWeatherIcon(conditionMain = "", description = "", iconCode = "") {
  const text = (description || conditionMain || "").toLowerCase();
  const isDay = typeof iconCode === "string" && iconCode.includes("d");

  // ===== DAY / NIGHT VARIANTS =====
  const dayNight = {
    clear: isDay ? WiDaySunny : WiNightClear,
    "clear sky": isDay ? WiDaySunny : WiNightClear,
    "few clouds": isDay ? WiDayCloudy : WiNightAltCloudy,
    "scattered clouds": WiCloud,
    "broken clouds": WiCloudy,
    "overcast clouds": WiCloudyWindy,
  };

  // ===== PRECIPITATION =====
  const rainMap = {
    drizzle: WiSprinkle,
    "light drizzle": WiSprinkle,
    "heavy drizzle": WiShowers,

    "light rain": WiSprinkle,
    "moderate rain": WiRain,
    "heavy rain": WiRainMix,
    "very heavy rain": WiRainMix,
    "extreme rain": WiRainMix,

    rain: WiRain,
    "freezing rain": WiRainMix,

    "light intensity shower rain": WiShowers,
    "shower rain": WiShowers,
    "heavy intensity shower rain": WiShowers,

    hail: WiHail,
  };

  // ===== SNOW / ICE =====
  const snowMap = {
    snow: WiSnow,
    "light snow": WiSnow,
    "heavy snow": WiSnowflakeCold,
    sleet: WiSleet,
    "light sleet": WiSleet,
    "heavy sleet": WiSleet,
    "rain and snow": WiRainMix,
    "light rain and snow": WiRainMix,
  };

  // ===== THUNDER =====
  const thunderMap = {
    thunderstorm: WiThunderstorm,
    "thunderstorm with light rain": WiThunderstorm,
    "thunderstorm with rain": WiThunderstorm,
    "thunderstorm with heavy rain": WiThunderstorm,
    "heavy thunderstorm": WiThunderstorm,
  };

  // ===== ATMOSPHERIC =====
  const atmosMap = {
    mist: WiFog,
    fog: WiFog,
    smoke: WiSmoke,
    haze: WiDayHaze,
    dust: WiDust,
    sand: WiSandstorm,
    ash: WiVolcano,
    squall: WiStrongWind,
    tornado: WiTornado,
  };

  // MERGE ALL MAPS
  const combined = {
    ...dayNight,
    ...rainMap,
    ...snowMap,
    ...thunderMap,
    ...atmosMap,
  };

  // DIRECT MATCH
  if (combined[text]) return combined[text];

  // TRY MAIN WORD ONLY (e.g. “broken clouds” → “clouds”)
  const first = text.split(" ")[0];
  if (combined[first]) return combined[first];

  // LAST FALLBACK
  return WiCloudyWindy;
}

// Icon color
export function iconColor(description = "") {
  const d = (description || "").toLowerCase();

  // ===== DAY / NIGHT =====
  if (d.includes("clear")) return "#facc15";            // yellow sun
  if (d.includes("few clouds")) return "#fcd34d";      // light yellow
  if (d.includes("scattered clouds")) return "#a3a3a3"; // light gray
  if (d.includes("broken clouds")) return "#6b7280";   // medium gray
  if (d.includes("overcast clouds")) return "#374151"; // dark gray

  // ===== RAIN / DRIZZLE =====
  if (d.includes("drizzle") || d.includes("showers")) return "#60a5fa"; // light blue
  if (d.includes("light rain")) return "#3b82f6";     // blue
  if (d.includes("moderate rain")) return "#2563eb";  // darker blue
  if (d.includes("heavy rain") || d.includes("very heavy rain")) return "#1e40af"; // navy
  if (d.includes("extreme rain") || d.includes("freezing rain")) return "#1e3a8a"; // deep navy
  if (d.includes("hail")) return "#e0f2fe";           // icy blue

  // ===== SNOW / SLEET =====
  if (d.includes("snow")) return "#93c5fd";           // soft blue
  if (d.includes("light snow")) return "#bfdbfe";     // lighter blue
  if (d.includes("heavy snow")) return "#60a5fa";     // medium blue
  if (d.includes("sleet")) return "#a5b4fc";          // lavender-blue
  if (d.includes("rain and snow")) return "#818cf8";  // violet-blue

  // ===== THUNDER =====
  if (d.includes("thunder") || d.includes("storm")) return "#2563eb";    // electric blue
  if (d.includes("heavy thunderstorm")) return "#1e40af"; // dark electric

  // ===== ATMOSPHERIC =====
  if (d.includes("mist")) return "#cbd5e1";          // pale gray
  if (d.includes("fog")) return "#94a3b8";           // medium gray
  if (d.includes("smoke")) return "#6b7280";         // gray
  if (d.includes("haze")) return "#fbbf24";          // yellow-orange
  if (d.includes("dust")) return "#fcd34d";          // light orange
  if (d.includes("sand")) return "#f59e0b";          // amber
  if (d.includes("ash")) return "#525252";           // dark gray
  if (d.includes("squall")) return "#1e3a8a";        // deep navy
  if (d.includes("tornado")) return "#dc2626";       // red alert

  // ===== FALLBACK =====
  return "#60bdf8"; // default blue
}


// DO NOT TOUCH BACKGROUND SYSTEM
export function normalizeBackgroundKey(text = "") {
  if (!text) return "default";

  return text
    .toLowerCase()
    .replace(/\s+/g, "-")     // spaces → hyphens
    .replace(/[^\w-]/g, "");  // remove weird characters
}

// Convert the 5-day / 3-hour forecast list into 5 daily summary objects
export function groupForecastToDays(list = []) {
  if (!Array.isArray(list) || list.length === 0) return [];

  const days = {};

  // Group forecast entries by calendar day (YYYY-MM-DD)
  list.forEach(item => {
    const date = item.dt_txt.split(" ")[0]; // e.g. "2025-11-15"
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });

  // Convert each grouped day into a simple summary
  return Object.keys(days).map(date => {
    const entries = days[date];

    // Prefer midday (12:00) as the day's representative
    const middayEntry =
      entries.find(e => e.dt_txt.includes("12:00:00")) || entries[Math.floor(entries.length / 2)];

    const { main, weather } = middayEntry;

    return {
      date,
      temp: main.temp,
      minTemp: Math.min(...entries.map(e => e.main.temp_min)),
      maxTemp: Math.max(...entries.map(e => e.main.temp_max)),
      condition: weather[0].main,
      description: weather[0].description,
      icon: weather[0].icon,
      raw: entries, // keep the full dataset for advanced use
    };
  });
}
