import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  FaTachometerAlt,
  FaCloudSun,
  FaStore,
  FaLandmark,
  FaCog,
} from "react-icons/fa";

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Current Weather
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Beed&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        const data = await response.json();
        if (response.ok) setWeather(data);

        // Forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=Beed&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        const forecastData = await forecastRes.json();

        const dailyForecasts = forecastData.list
          .filter((item) => item.dt_txt.includes("12:00:00"))
          .slice(0, 3);

        setForecast(dailyForecasts);
      } catch (err) {
        console.error("Error fetching weather/forecast:", err);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img
            src="src/assets/Hd Logo normal.png"
            alt="Smart Kisan Logo"
            className="logo-img"
          />
        </div>
        <div className="main-text">🌾 Smart Kisan Hub</div>

        <nav className="nav-links">
          <a className="active">
            <FaTachometerAlt className="icon" /> Dashboard
          </a>
          <a>
            <FaCloudSun className="icon" /> Weather
          </a>
          <a>
            <FaStore className="icon" /> Mandi Prices
          </a>
          <a>
            <FaLandmark className="icon" /> Gov. Schemes
          </a>
        </nav>

        <div className="quote-box">
          <p>🌱 Quote of the Day</p>
        </div>

        <div className="settings">
          <FaCog className="icon" /> Settings
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="dashboard-content">
        <div className="dashboard-header">
          <div className="top-bar">
            <div className="location">
              📍 Your Location <button>Change</button>
            </div>
          </div>
        </div>

        <div className="main-body">
          {/* Dashboard Left Grid */}
          <div className="dashboard-grid">
            <div className="top-row">
              <div className="card small temp-card">
                {weather ? (
                  <div className="temp-content">
                    <div className="temp-row">
                      <img
                        className="weather-icon"
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                        alt={weather.weather[0].main}
                      />
                      <h2 className="temp-value">
                        {Math.round(weather.main.temp)}°C
                      </h2>
                    </div>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              <div className="card small">📉 Mandi Prices</div>
            </div>

            <div className="card large">📊 Price Trend Graph</div>

            <div className="forecast-row">
              {forecast.map((item, index) => (
                <div key={index} className="card small forecast-card">
                  <div className="forecast-row-content">
                    <img
                      className="weather-icon"
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].main}
                    />
                    <span className="forecast-day">
                      {new Date(item.dt_txt).toLocaleDateString("en-IN", {
                        weekday: "short",
                      })}
                    </span>
                    <span className="forecast-temp">
                      {Math.round(item.main.temp)}°C
                    </span>
                    <span className="forecast-condition">
                      {item.weather[0].main}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar Cards */}
          <div className="right-sidebar">
            <div className="card tall">🌩️ Alerts</div>
            <div className="card tall">📜 Gov Scheme 1</div>
            <div className="card tall">📜 Gov Scheme 2</div>
            <div className="card tall">📜 Gov Scheme 3</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
