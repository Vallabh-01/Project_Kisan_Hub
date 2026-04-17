/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import MandiPriceGraph from "../Components/MandiPriceGraph";
import DistrictSelect from "../Components/DistrictSelect";
import getWeatherIcon from "../utils/getWeatherIcon";
import { FaTachometerAlt, FaCloudSun, FaStore, FaLandmark, FaCog, } from "react-icons/fa";
import { useLocationContext } from "../context/LocationContext";
import logo from "../assets/logo_only.png";

const Dashboard = () => {
  const [quote, setQuote] = useState("Loading...");
  const [quotes, setQuotes] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [districts, setDistricts] = useState([]);
  const { district, setDistrict } = useLocationContext();
  const [mandiData, setMandiData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const handleSelectDistrict = (value) => {
  setDistrict(value);   //  use context setter
  setShowLocationModal(false);
};
 
   // Fetch daily quote from local JSON file, with error handling and fallback message
  useEffect(() => {
  const loadQuotes = async () => {
    try {
      const res = await fetch("/data/quotes.json");
      const data = await res.json();
      setQuotes(data);
    } catch (err) {
      console.error("Error loading quotes:", err);
    }
  };

  loadQuotes();
}, []);

useEffect(() => {
  if (quotes.length === 0) return;

  const interval = setInterval(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, 10000);

  return () => clearInterval(interval);
}, [quotes]);

  // fetch districts from local JSON file and set in state for dropdown, also handle errors if file fails to load
  useEffect(() => {
    fetch("/data/maharashtra-mandi-full.json")
      .then(res => res.json())
      .then(data => {
        const uniqueDistricts = [...new Set(data.map(entry => entry.District))];
        setDistricts(uniqueDistricts);
      })
      .catch(err => console.error("Failed to load districts:", err));
  }, []);

  // fetch weather data based on selected district, with error handling and loading state
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${district}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        const data = await res.json();
        if (res.ok) setWeather(data);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${district}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        const forecastData = await forecastRes.json();

        const today = new Date().toISOString().split("T")[0];
        const dailyForecasts = [];
        const seenDates = new Set();

        for (let item of forecastData.list) {
          const date = item.dt_txt.split(" ")[0];

          if (date === today) continue;
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
}, [district]);

  // fetch mandi price data based on selected district, with error handling and loading state
  useEffect(() => {
    fetch("/data/maharashtra-mandi-full.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (entry) => entry.District.toLowerCase() === district.toLowerCase()
        );
        setMandiData(filtered.slice(0, 2));
      })
      .catch((err) => console.error("Mandi fetch error:", err));
 }, [district]);

  // fetch agriculture news alerts from backend API, with error handling and loading state
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("https://digital-kisan-hub.onrender.com/api/agri-news");
        const data = await response.json();
        console.log("Alert Data:", data);

        if (data.status === "success" && data.results?.length > 0) {
          setAlerts(data.results.slice(0, 5));
        } else {
          setAlerts([]);
        }
      } catch (err) {
        console.error("Error fetching alert news:", err);
        setAlerts([]);
      }
    };

    fetchAlerts();
  }, []);

  // Auto-rotate agriculture news alerts every 5 seconds, with cleanup to prevent memory leaks
  useEffect(() => {
    if (alerts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentNewsIndex(prevIndex =>
        prevIndex === alerts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // change every 5 seconds

    return () => clearInterval(interval);
  }, [alerts]);

  // Randomly select 3 schemes from combined central and state schemes, with useEffect dependency on schemesData to ensure it runs after data is loaded
  useEffect(() => {
  const loadSchemes = async () => {
    try {
      const res = await fetch("/data/gov-schemes.json");
      const data = await res.json();

      const allSchemes = data.government_schemes.flatMap(item => item.schemes);
      const shuffled = allSchemes.sort(() => 0.5 - Math.random());

      setSchemes(shuffled.slice(0, 3));
    } catch (err) {
      console.error("Error loading schemes:", err);
    }
  };

  loadSchemes();
}, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar-dashboard">
        <div className="logo">
          <img
            src={logo} alt="logo"
            className="logo-img"
          />
        </div>
        <div className="main-text">Welcome to Kisan Hub</div>
        <nav className="nav-links">
          <Link to="/dashboard" ><FaTachometerAlt className="icon" /> Dashboard</Link>
          <Link to="/weather"><FaCloudSun className="icon" /> Weather</Link>
          <Link to="/MandiPrices"><FaStore className="icon" /> Mandi Prices</Link>
          <Link to="/GovSchemes"><FaLandmark className="icon" /> Gov. Schemes</Link>
          <Link to="/userprofile"><FaCog className="icon" /> Profile</Link>
        </nav>

        <div className="quote-box">
          <strong>🌱 Quote of the Day</strong>
          <p style={{ fontSize: "0.9rem", marginTop: "5px" }}>{quote}</p>
        </div>
      </aside>

      <main className="dashboard-content">
        <div className="top-bar">
          <div className="location-display">
            <DistrictSelect
              districts={districts}
              selectedDistrict={district}
              onChange={e => setDistrict(e.target.value)}
            />
          </div>
        </div>

        {showLocationModal && (
          <div className="location-modal">
            <h3>Select District</h3>
            <div className="district-list">
              {districts.map((item) => (
                <button
                  key={district}
                  onClick={() => handleSelectDistrict(district)}
                  className={district === district ? "active" : ""}
                >
                  {item}
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
                        className="weather-icon-main"
                        src={getWeatherIcon(
                          weather.weather[0].main,
                          weather.weather[0].icon
                        )}
                        alt={weather.weather[0].main}
                      />
                      <h2 className="temp-value">{Math.round(weather.main.temp)}°C</h2>
                    </div>
                  </div>
                ) : <p>Loading...</p>}
              </div>

              <div className="card small mandi-prices-card">
                <div className="mandi-row">
                  {mandiData.length > 0 ? mandiData.map((item, index) => {
  const latestDate = Object.keys(item.Prices).slice(-1)[0];

  return (
    <div key={index} className="mandi-block">
      <div className="commodity">{item.Commodity} ({item.Variety})</div>
      <div className="price">₹{item.Prices[latestDate]}</div>
      <div className="market">{item["Mandi Name"]}</div>
    </div>
  );
}) : <p>Loading...</p>}
                </div>
              </div>
            </div>

            <MandiPriceGraph district={district} />

            <div className="forecast-row">
              {forecast.map((item, idx) => (
                <div key={idx} className="card small forecast-card">
                  <div className="forecast-compact">
                    <span>{new Date(item.dt_txt).toLocaleDateString("en-IN", { weekday: "short" })}</span>
                    <img
                      className="weather-icon"
                      src={getWeatherIcon(
                        item.weather[0].main,
                        item.weather[0].icon
                      )}
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
            <div className="card tall">
              {alerts.length === 0 ? (
                <p>No agriculture updates available at the moment.</p>
              ) : (
                <div style={{ fontSize: "0.85rem", color: "#333" }}>
                  <a
                    href={alerts[currentNewsIndex].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "#2c3e50", fontWeight: "600" }}
                  >
                    {alerts[currentNewsIndex].title.length > 130
                      ? alerts[currentNewsIndex].title.slice(0, 90) + "..."
                      : alerts[currentNewsIndex].title}
                  </a>

                  <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "#777" }}>
                    {alerts[currentNewsIndex].source_name} •{" "}
                    {new Date(alerts[currentNewsIndex].pubDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Schemes Cards — Only 3 Fixed Cards  */}
            <div className="card tall">
              {schemes[0] ? (
                <a href={schemes[0].link} target="_blank" rel="noopener noreferrer">
                  📜 {schemes[0].name.length > 75 ? schemes[0].name.slice(0, 75) + "..." : schemes[0].name}
                </a>
              ) : (
                <p>Loading Scheme 1...</p>
              )}
            </div>

            <div className="card tall">
              {schemes[1] ? (
                <a href={schemes[1].link} target="_blank" rel="noopener noreferrer">
                  📜 {schemes[1].name.length > 75 ? schemes[1].name.slice(0, 75) + "..." : schemes[1].name}
                </a>
              ) : (
                <p>Loading Scheme 2...</p>
              )}
            </div>

            <div className="card tall">
              {schemes[2] ? (
                <a href={schemes[2].link} target="_blank" rel="noopener noreferrer">
                  📜 {schemes[2].name.length > 75 ? schemes[2].name.slice(0, 75) + "..." : schemes[2].name}
                </a>
              ) : (
                <p>Loading Scheme 3...</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
