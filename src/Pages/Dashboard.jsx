import React from "react";
import "./Dashboard.css";
import {
    FaTachometerAlt,
    FaCloudSun,
    FaStore,
    FaLandmark,
    FaCog,
} from "react-icons/fa";

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo">
                    <img
                        src="src/assets/Hd logo normal.png"
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

            {/* Main Dashboard Content */}
            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="top-bar">
                        <div className="location">
                            📍 Your Location <button>Change</button>
                        </div>
                        <div className="profile-button">👤 Profile</div>
                    </div>
                </div>

                <div className="main-body">
                    <div className="dashboard-grid">
                        <div className="top-row">
                            <div className="card small">🌡️ Today’s Temperature</div>
                            <div className="card small">📉 Mandi Prices</div>
                        </div>

                        <div className="card large">📊 Price Trend Graph</div>

                        <div className="forecast-row">
                            <div className="card small">☀️ Tomorrow</div>
                            <div className="card small">🌤️ Day After</div>
                            <div className="card small">🌧️ 3 Days Later</div>
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
