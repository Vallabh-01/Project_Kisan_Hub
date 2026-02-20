/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import MandiPriceGraph from "../Components/MandiPriceGraph";
import DistrictSelect from "../Components/DistrictSelect";
import schemesData from '../Data/gov-schemes.json';
import { FaTachometerAlt, FaCloudSun, FaStore, FaLandmark, FaCog, } from "react-icons/fa";

const Dashboard = () => {
  const [quote, setQuote] = useState("Loading...");
  const [selectedDistrict, setSelectedDistrict] = useState("Pune");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [commodities, setCommodities] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("");

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setShowLocationModal(false);
  };

  useEffect(() => {
    if (!selectedMarket) return;

    const marketRecords = allRecords.filter(
      r =>
        r.district === selectedDistrict &&
        r.market === selectedMarket
    );

    const uniqueCommodities = [
      ...new Set(marketRecords.map(r => r.commodity))
    ];

    setCommodities(uniqueCommodities);
    setSelectedCommodity(uniqueCommodities[0] || "");

  }, [selectedMarket, selectedDistrict, allRecords]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/mandi");
        const data = await res.json();

        const records = data.records || [];

        setAllRecords(records);

        const uniqueDistricts = [
          ...new Set(records.map(r => r.district))
        ];

        setDistricts(uniqueDistricts);
        setSelectedDistrict(uniqueDistricts[0] || "");

      } catch (err) {
        console.error("Error fetching mandi data:", err);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (!selectedDistrict) return;

    const districtRecords = allRecords.filter(
      r => r.district === selectedDistrict
    );

    const uniqueMarkets = [
      ...new Set(districtRecords.map(r => r.market))
    ];

    setMarkets(uniqueMarkets);
    setSelectedMarket(uniqueMarkets[0] || "");

  }, [selectedDistrict, allRecords]);

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
    const allSchemes = schemesData.government_schemes.flatMap(item => item.schemes);
    const shuffled = allSchemes.sort(() => 0.5 - Math.random());
    setSchemes(shuffled.slice(0, 3));
  }, []);

  const filteredData = allRecords.filter(
    r =>
      r.district === selectedDistrict &&
      r.market === selectedMarket &&
      r.commodity === selectedCommodity
  );

  return (
    <div className="dashboard-container">
      <aside className="sidebar-dashboard">
        <div className="logo">
          <img
            src="src/assets/Hd Logo normal.png"
            alt="Smart Kisan Logo"
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

      <div className="top-bar">
        <div className="location-display">

          {/* District Dropdown */}
          <DistrictSelect
            districts={districts}
            selectedDistrict={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
          />
          {/*market dropdown*/}
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            {markets.map((market, index) => (
              <option key={index} value={market}>
                {market}
              </option>
            ))}
          </select>
          {/* Commodity Dropdown */}
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            {commodities.map((com, index) => (
              <option key={index} value={com}>
                {com}
              </option>
            ))}
          </select>

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
                {filteredData.length > 0 ? (
                  filteredData.slice(0, 2).map((item, index) => (
                    <div key={index} className="mandi-block">
                      <div className="commodity">{item.commodity}</div>
                      <div className="price">₹{item.modal_price}</div>
                      <div className="market">{item.market}</div>
                    </div>
                  ))
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>

          <MandiPriceGraph records={filteredData} />

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
    </div>
  );
};

export default Dashboard;
