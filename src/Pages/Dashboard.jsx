import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import MandiPriceGraph from "../Components/MandiPriceGraph";
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
const [quote, setQuote] = useState("Loading...");
  const [selectedDistrict, setSelectedDistrict] = useState("Beed");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [mandiData, setMandiData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const handleChangeLocation = () => setShowLocationModal(!showLocationModal);
  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setShowLocationModal(false);
  };

useEffect(() => {
  const fetchQuote = async () => {
    try {
      const res = await fetch("https://zenquotes.io/api/today");
      const data = await res.json();
      if (data && data[0]?.q) {
        setQuote(`${data[0].q} — ${data[0].a}`);
      } else {
        setQuote("Stay positive and keep growing! 🌱");
      }
    } catch (error) {
      console.error("Quote fetch failed:", error);
      setQuote("Grow with consistency. 🌾");
    }
  };

  fetchQuote();
}, []);


  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedDistrict}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        const data = await res.json();
        if (res.ok) setWeather(data);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selectedDistrict}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
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
  }, [selectedDistrict]);

  useEffect(() => {
    fetch("/src/Data/maharashtra-mandi-full.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (entry) => entry.District.toLowerCase() === selectedDistrict.toLowerCase()
        );
        setMandiData(filtered.slice(0, 2));
      })
      .catch((err) => console.error("Mandi fetch error:", err));
  }, [selectedDistrict]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWS_API_KEY}&q=alert%20OR%20emergency%20OR%20warning%20OR%20disaster&country=in&language=en`
        );
        const data = await response.json();
        console.log("Alert Data:", data);

        if (data?.results?.length > 0) {
          const filtered = data.results.filter(item => {
            const content = `${item.title} ${item.description}`.toLowerCase();
            return (
              content.includes("maharashtra") &&
              (content.includes("alert") ||
                content.includes("emergency") ||
                content.includes("warning") ||
                content.includes("disaster"))
            );
          });
          console.log("Filtered Alerts:", filtered);

          console.log("All Alerts Returned:", data.results);
          setAlerts(filtered.slice(0, 5));
        } else {
          console.log("No alert results found");
          setAlerts([]);
        }
      } catch (err) {
        console.error("Error fetching alert news:", err);
        setAlerts([]);
      }
    };

    fetchAlerts();
  }, []);

useEffect(() => {
  const fetchSchemes = async () => {
    try {
      const res = await fetch(
        `https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWS_API_KEY}&q=farmer+scheme+OR+government+scheme+OR+kisan+yojana&country=in&language=en`
      );
      const data = await res.json();

      if (data?.results?.length > 0) {
        // Filter and limit to 3
        const filtered = data.results.filter(item =>
          item.title?.toLowerCase().includes("scheme") || item.title?.toLowerCase().includes("yojana")
        );
        setSchemes(filtered.slice(0, 3));
      } else {
        setSchemes([]);
      }
    } catch (err) {
      console.error("Error fetching schemes:", err);
      setSchemes([]);
    }
  };

  fetchSchemes();
}, []);


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
        <div className="main-text">Welcome to Kisan Hub</div>
        <nav className="nav-links">
          <a className="active">
            <FaTachometerAlt className="icon" /> Dashboard
          </a>
          <a><FaCloudSun className="icon" /> Weather</a>
          <a><FaStore className="icon" /> Mandi Prices</a>
          <a><FaLandmark className="icon" /> Gov. Schemes</a>
          <a><FaCog className="icon" /> Settings</a>
        </nav>
        <div className="quote-box">
  <strong>🌱 Quote of the Day</strong>
  <p style={{ fontSize: "0.9rem", marginTop: "5px" }}>{quote}</p>
</div>
{/* 
        <div className="settings"><FaCog className="icon" /> Settings</div> */}
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

            <MandiPriceGraph district={selectedDistrict} />

            <div className="forecast-row">
              {forecast.map((item, idx) => (
                <div key={idx} className="card small forecast-card">
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
  <div className="card tall">
    {alerts.length === 0 ? (
      <p>No critical alerts found for Maharashtra at the moment.</p>
    ) : (
      <ul style={{ paddingLeft: "1rem", fontSize: "0.9rem", color: "#333" }}>
        {alerts.map((alert, idx) => (
          <li key={idx}>
            <a href={alert.link} target="_blank" rel="noopener noreferrer">
              {alert.title.length > 75 ? alert.title.slice(0, 75) + "..." : alert.title}
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Schemes — Only 3 Fixed Cards */}
  <div className="card tall">
    {schemes[0] ? (
      <a href={schemes[0].link} target="_blank" rel="noopener noreferrer">
        📜 {schemes[0].title.length > 75 ? schemes[0].title.slice(0, 75) + "..." : schemes[0].title}
      </a>
    ) : (
      <p>Loading Scheme 1...</p>
    )}
  </div>

  <div className="card tall">
    {schemes[1] ? (
      <a href={schemes[1].link} target="_blank" rel="noopener noreferrer">
        📜 {schemes[1].title.length > 75 ? schemes[1].title.slice(0, 75) + "..." : schemes[1].title}
      </a>
    ) : (
      <p>Loading Scheme 2...</p>
    )}
  </div>

  <div className="card tall">
    {schemes[2] ? (
      <a href={schemes[2].link} target="_blank" rel="noopener noreferrer">
        📜 {schemes[2].title.length > 75 ? schemes[2].title.slice(0, 75) + "..." : schemes[2].title}
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
