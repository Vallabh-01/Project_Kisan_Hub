// src/Pages/Weather.jsx
import React from "react";
import "./Weather.css";
import {
  FaTachometerAlt,
  FaCloudSun,
  FaStore,
  FaLandmark,
  FaCog,
} from "react-icons/fa";

const Weather = () => {
  return (
    <div className="weather-container">
      <aside className="weather-sidebar">
        <div className="weather-logo">
          <img src="src/assets/Hd Logo normal.png" alt="Logo" className="logo-img" />
        </div>
        <nav className="weather-icons">
          <FaTachometerAlt />
          <FaCloudSun className="active" />
          <FaStore />
          <FaLandmark />
          <FaCog />
        </nav>
      </aside>

      <main className="weather-main">
        <div className="weather-search">
          <input type="text" placeholder="🔍 Set Location...." />
        </div>

        <div className="weather-top-cards">
          <div className="weather-card small-card">Today's Weather with other details</div>
          <div className="weather-card wide-card">5 Day's Weather Forecast</div>
        </div>

        <div className="weather-alert">
          Tips / Alerts related to the Weather
        </div>

        <div className="weather-bottom-cards">
          <div className="left-cards">
            <div className="weather-card-left">Sunrise and Sunset</div>
            <div className="weather-card-left">Moonrise and Moonset</div>
          </div>
          <div className="weather-card graph-card">Last 3 Day's Weather Graph</div>
        </div>
      </main>
    </div>
  );
};

export default Weather;
