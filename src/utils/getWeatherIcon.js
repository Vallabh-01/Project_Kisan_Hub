import clearDay from "../assets/weather-icons/clear-day.png";
import clearNight from "../assets/weather-icons/clear-night.png";
import clouds from "../assets/weather-icons/clouds.png";
import cloudyNight from "../assets/weather-icons/cloudy-night.png";
import rain from "../assets/weather-icons/rain.png";
import rainingNight from "../assets/weather-icons/raining-night.png";
import stormDay from "../assets/weather-icons/storm-day.png";
import stormNight from "../assets/weather-icons/storm-night.png";
import snow from "../assets/weather-icons/snow.png";
import snowNight from "../assets/weather-icons/snow-night.png";
import mist from "../assets/weather-icons/mist.png";
import haze from "../assets/weather-icons/haze.png";
import smoke from "../assets/weather-icons/smoke.png";

const getWeatherIcon = (weatherMain, iconCode) => {
  const isNight = iconCode?.includes("n");

  switch (weatherMain?.toLowerCase()) {
    case "clear":
      return isNight ? clearNight : clearDay;

    case "clouds":
      return isNight ? cloudyNight : clouds;

    case "rain":
    case "drizzle":
      return isNight ? rainingNight : rain;

    case "thunderstorm":
      return isNight ? stormNight : stormDay;

    case "snow":
      return isNight ? snowNight : snow;

    case "mist":
    case "fog":
      return mist;

    case "haze":
      return haze;

    case "smoke":
      return smoke;

    default:
      return clearDay;
  }
};

export default getWeatherIcon;