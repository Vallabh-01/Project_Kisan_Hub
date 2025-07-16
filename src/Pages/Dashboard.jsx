import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  FaTachometerAlt,
  FaCloudSun,
  FaStore,
  FaLandmark,
  FaCog,
} from "react-icons/fa";

const districts = [
  "Beed", "Yavatmal", "Nagpur", "Pune", "Nashik",
  "Aurangabad", "Latur", "Kolhapur", "Solapur"
];

const Dashboard = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("Beed");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [mandiData, setMandiData] = useState([]);

  const handleChangeLocation = () => setShowLocationModal(!showLocationModal);

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setShowLocationModal(false);
  };

 useEffect(() => {
  const fetchWeather = async () => {
    try {
      // 🔸 Fetch current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedDistrict}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
      );
      const data = await res.json();
      if (res.ok) setWeather(data);

      // 🔸 Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedDistrict}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
      );
      const forecastData = await forecastRes.json();

      // 🔸 Filter next 3 days (excluding today)
      const today = new Date().toISOString().split("T")[0];
      const dailyForecasts = [];
      const seenDates = new Set();

      for (let item of forecastData.list) {
        const date = item.dt_txt.split(" ")[0];

        if (date === today) continue; // skip today
        if (!seenDates.has(date)) {
          dailyForecasts.push(item);
          seenDates.add(date);
        }

        if (dailyForecasts.length === 3) break;
      }

      setForecast(dailyForecasts);
    } catch (err) {
      console.error("Weather fetch error:", err);
    }
  };

  fetchWeather();
}, [selectedDistrict]);


  useEffect(() => {
    fetch("/maharashtra-mandi-full.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (entry) => entry.District.toLowerCase() === selectedDistrict.toLowerCase()
        );
        setMandiData(filtered.slice(0, 2));
      })
      .catch((err) => console.error("Mandi fetch error:", err));
  }, [selectedDistrict]);

  return (
    <div className="dashboard-container">
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
          <a><FaCloudSun className="icon" /> Weather</a>
          <a><FaStore className="icon" /> Mandi Prices</a>
          <a><FaLandmark className="icon" /> Gov. Schemes</a>
        </nav>
        <div className="quote-box">🌱 Quote of the Day</div>
        <div className="settings"><FaCog className="icon" /> Settings</div>
      </aside>

      <main className="dashboard-content">
        <div className="top-bar">
          <div className="location-display">
            📍 {selectedDistrict} <button onClick={handleChangeLocation}>Change</button>
          </div>
        </div>

        {showLocationModal && (
          <div className="location-modal">
            <h3>Select District</h3>
            <div className="district-list">
              {districts.map((district) => (
                <button
                  key={district}
                  onClick={() => handleSelectDistrict(district)}
                  className={district === selectedDistrict ? "active" : ""}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="main-body">
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
                      <h2 className="temp-value">{Math.round(weather.main.temp)}°C</h2>
                    </div>
                  </div>
                ) : <p>Loading...</p>}
              </div>

              <div className="card small mandi-prices-card">
                <div className="mandi-row">
                  {mandiData.length > 0 ? mandiData.map((item, index) => (
                    <div key={index} className="mandi-block">
                      <div className="commodity">{item.Commodity} ({item.Variety})</div>
                      <div className="price">₹{item.Prices["Jul 16"]}</div>
                      <div className="market">{item["Mandi Name"]}</div>
                    </div>
                  )) : <p>Loading...</p>}
                </div>
              </div>
            </div>

            <div className="card large">📊 Price Trend Graph</div>

            <div className="forecast-row">
              {forecast.map((item) => (
                <div className="card small forecast-card">
                  <div className="forecast-compact">
                    <span>{new Date(item.dt_txt).toLocaleDateString("en-IN", { weekday: "short" })}</span>
                    <img
                      className="weather-icon"
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].main}
                    />
                    <span>{Math.round(item.main.temp)}°C</span>
                    <span>{item.weather[0].main}</span>
                  </div>
                </div>

              ))}
            </div>

          </div>

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