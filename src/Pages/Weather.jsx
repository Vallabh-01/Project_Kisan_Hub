/* eslint-disable no-unused-vars */
// src/Pages/Weather.jsx
import React, { useState, useEffect } from "react";
import "./Weather.css";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const Weather = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("Beed");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [sunMoonData, setSunMoonData] = useState(null);
  const [historicalWeather, setHistoricalWeather] = useState([]);

  const handleChangeLocation = () => setShowLocationModal(!showLocationModal);
  
  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setShowLocationModal(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedDistrict(searchInput.trim());
      setSearchInput("");
    }
  };

  // Fetch current weather and forecast
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedDistrict}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        const data = await res.json();
        if (res.ok) {
          setWeather(data);
          // Extract sun/moon data
          setSunMoonData({
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          });
        }

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selectedDistrict}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        const forecastData = await forecastRes.json();

        if (forecastRes.ok) {
          // Get 5-day forecast
          const dailyForecasts = [];
          const seenDates = new Set();

          for (let item of forecastData.list) {
            const date = item.dt_txt.split(" ")[0];
            if (!seenDates.has(date)) {
              dailyForecasts.push(item);
              seenDates.add(date);
            }
            if (dailyForecasts.length === 5) break;
          }
          setForecast(dailyForecasts);

          // Get historical data for temperature graph (last 4 days)
          const currentTime = new Date();
          const historicalData = [];
          
          for (let i = 0; i < Math.min(forecastData.list.length, 32); i += 8) { // Every 8th entry is roughly 1 day (3-hour intervals)
            const item = forecastData.list[i];
            const date = new Date(item.dt * 1000);
            historicalData.push({
              name: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
              temperature: Math.round(item.main.temp),
              date: date.toISOString().split('T')[0]
            });
          }
          
          setHistoricalWeather(historicalData.slice(0, 4));
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    fetchWeather();
  }, [selectedDistrict]);

  // Fetch weather alerts
  useEffect(() => {
    const fetchWeatherAlerts = async () => {
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWS_API_KEY}&q=weather%20alert%20OR%20storm%20OR%20cyclone%20OR%20rain%20warning&country=in&language=en`
        );
        const data = await response.json();

        if (data?.results?.length > 0) {
          const filtered = data.results.filter(item => {
            const content = `${item.title} ${item.description}`.toLowerCase();
            return content.includes("maharashtra") || content.includes("weather");
          });
          setWeatherAlerts(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching weather alerts:", err);
        setWeatherAlerts([]);
      }
    };

    fetchWeatherAlerts();
  }, []);

  return (
    <div className="weather-container">
      <aside className="weather-sidebar">
        <div className="weather-logo">
          <img src="src/assets/Hd Logo normal.png" alt="Logo" className="logo-img" />
        </div>
        <nav className="weather-icons">
          <Link to="/"><FaTachometerAlt /></Link>
          <Link to="/weather"><FaCloudSun className="active" /></Link>
          <Link to="/mandi"><FaStore /></Link>
          <Link to="/schemes"><FaLandmark /></Link>
          <FaCog />
        </nav>
      </aside>

      <main className="weather-main">
        <div className="weather-search">
          <div className="location-display">
            📍 {selectedDistrict} 
            <button onClick={handleChangeLocation}>Change</button>
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

        <div className="weather-top-cards">
          <div className="weather-card small-card">
            {weather ? (
              <div className="current-weather">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].main}
                  style={{ width: '50px', height: '50px' }}
                />
                <div className="weather-details">
                  <h2>{Math.round(weather.main.temp)}°C</h2>
                  <p>{weather.weather[0].description}</p>
                  <p>Feels: {Math.round(weather.main.feels_like)}°C</p>
                  <p>Humidity: {weather.main.humidity}%</p>
                  <p>Wind: {weather.wind.speed} m/s</p>
                </div>
              </div>
            ) : (
              <p>Loading current weather...</p>
            )}
          </div>
          
          <div className="weather-card wide-card">
            <h3>5 Day Weather Forecast</h3>
            <div className="forecast-container">
              {forecast.length > 0 ? forecast.map((item, idx) => (
                <div key={idx} className="forecast-item">
                  <div className="forecast-day">
                    {new Date(item.dt_txt).toLocaleDateString("en-IN", { 
                      weekday: "short"
                    })}
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt={item.weather[0].main}
                    style={{ width: '30px', height: '30px' }}
                  />
                  <div className="forecast-temp">
                    {Math.round(item.main.temp)}°C
                  </div>
                </div>
              )) : (
                <p>Loading forecast...</p>
              )}
            </div>
          </div>
        </div>

        <div className="weather-alert">
          <h3>🚨 Weather Alert</h3>
          {weatherAlerts.length > 0 ? (
            <div className="single-alert">
              <a href={weatherAlerts[0].link} target="_blank" rel="noopener noreferrer">
                {weatherAlerts[0].title.length > 120 ? weatherAlerts[0].title.slice(0, 120) + "..." : weatherAlerts[0].title}
              </a>
            </div>
          ) : (
            <div className="weather-tip">
              <p>💡 Check weather conditions before planning outdoor activities and stay hydrated during hot weather.</p>
            </div>
          )}
        </div>

        <div className="weather-bottom-cards">
          <div className="left-cards">
            <div className="weather-card-left">
              {/* <h4>☀️ Sunrise and Sunset</h4> */}
              {sunMoonData ? (
                <div>
                  <p>🌅 Sunrise: {sunMoonData.sunrise}</p>
                  <p>🌇 Sunset: {sunMoonData.sunset}</p>
                </div>
              ) : (
                <p>Loading sun data...</p>
              )}
            </div>
            
            <div className="weather-card-left">
              {/* <h4>🌙 Moon Phase Info</h4> */}
              {weather ? (
                <div>
                  <p>🌡️ Night Temp: {Math.round(weather.main.temp_min)}°C</p>
                  <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
                  <p>👁️ Visibility: {weather.visibility / 1000} km</p>
                </div>
              ) : (
                <p>Loading moon data...</p>
              )}
            </div>
          </div>
          
          <div className="weather-card graph-card">
            <h4>📊 Temperature Trend (Last 4 Days)</h4>
            {historicalWeather.length > 0 ? (
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={historicalWeather}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}°C`, 'Temperature']}
                    labelStyle={{ color: '#333' }}
                    contentStyle={{ 
                      backgroundColor: '#f8f9fa', 
                      border: '1px solid #0a812a',
                      borderRadius: '4px' 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#0a812a" 
                    strokeWidth={2}
                    dot={{ fill: '#0a812a', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#0a812a', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>Loading temperature trend...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Weather;