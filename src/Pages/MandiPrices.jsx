// MandiPrices.jsx
import React from 'react';
import { Link } from "react-router-dom";
import './MandiPrices.css';
import {
  FaTachometerAlt,
  FaCloudSun,
  FaStore,
  FaLandmark,
  FaCog,
} from "react-icons/fa";

const MandiPrices = () => {
    return (
        <div className="mandi-container">
            <aside className="Mandi-sidebar">
                    <div className="Mandi-logo">
                      <img src="src/assets/Hd Logo normal.png" alt="Logo" className="logo-img" />
                    </div>
                    <nav className="Mandi-icons">
                      <Link to="/"><FaTachometerAlt /></Link>
                      <Link to="/weather"><FaCloudSun /></Link>
                      <Link to="/MandiPrices"><FaStore className="active" /></Link>
                      <Link to="/schemes"><FaLandmark /></Link>
                      <FaCog />
                    </nav>
                  </aside>

            <main className="content-area">
                <header className="search-section">
                    <input type="text" placeholder="Search for the crops ...." className="search-input" />
                    <input type="text" placeholder="Set Mandi Location..." className="search-input" />
                </header>

                <section className="price-table-section">
                    <h2>Today's Prices</h2>
                    <div className="price-table">
                        <div className="table-header">
                            <span>Crop</span>
                            <span>Today's price</span>
                            <span>Yesterday's Price</span>
                            <span>Change</span>
                        </div>
                        <div className="table-rows">
                            {/* Dynamic rows go here */}
                        </div>
                    </div>
                </section>

                <section className="price-trend-section">
                    <div className="trend-card">
                        <p>Price Trend of the selected crop</p>
                        <p>( last 7 day's )</p>
                    </div>
                    <div className="tips-card">
                        <p>If their is any kind of tip for crop it is displayed here.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MandiPrices;
