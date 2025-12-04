export default function groupForecastByDay(list = []) {
  const days = {};

  list.forEach((item) => {
    // item expected to be an OpenWeather 3-hour forecast object
    const date = item.dt_txt ? item.dt_txt.split(" ")[0] : new Date(item.dt * 1000).toISOString().split("T")[0];

    if (!days[date]) {
      days[date] = {
        day: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
        temp: {
          min: item.main.temp_min,
          max: item.main.temp_max,
        },
        weather: [
          {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon, // keep the icon code for day/night
          },
        ],
      };
    } else {
      // update rolling min/max
      days[date].temp.min = Math.min(days[date].temp.min, item.main.temp_min);
      days[date].temp.max = Math.max(days[date].temp.max, item.main.temp_max);

      // keep the first weather entry for that day (no overwrite) — consistent & simple
    }
  });

  // return first 5 days (or less if data small) as array
  return Object.values(days).slice(0, 5);
}
