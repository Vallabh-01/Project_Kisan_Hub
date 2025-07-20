// MandiPrices.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './MandiPrices.css';
import {
    FaTachometerAlt,
    FaCloudSun,
    FaStore,
    FaLandmark,
    FaCog,
} from "react-icons/fa";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);


const MandiPrices = () => {
    const [mandiData, setMandiData] = useState([]);
    const [tips, setTips] = useState({});
useEffect(() => {
  fetch("/src/Data/tips.json")
    .then((res) => res.json())
    .then((data) => setTips(data))
    .catch((err) => console.error("Error loading tips:", err));
}, []);
const getCropTip = (commodity) => {
  const key = commodity?.toLowerCase();
  return tips[key] || "Follow best practices to increase yield.";
};


    const [districts, setDistricts] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const selectedDistrict = queryParams.get("district") || "Beed";

    useEffect(() => {
        fetch("/src/Data/maharashtra-mandi-full.json")
            .then((res) => res.json())
            .then((data) => {
                const uniqueDistricts = [...new Set(data.map(entry => entry.District))];
                setDistricts(uniqueDistricts);

                const filtered = data.filter(
                    (entry) => entry.District.toLowerCase() === selectedDistrict.toLowerCase()
                );
                setMandiData(filtered.slice(0, 6));
            })
            .catch((err) => console.error("Error loading mandi data:", err));
    }, [selectedDistrict]);

    const handleDistrictChange = (e) => {
        const district = e.target.value;
        navigate(`/MandiPrices?district=${district}`);
    };

    return (
        <div className="mandi-container">
            <aside className="Mandi-sidebar">
                <div className="Mandi-logo">
                    <img src="src/assets/Hd Logo normal.png" alt="Logo" className="logo-img" />
                </div>
                <nav className="Mandi-icons">
                    <Link to="/"><FaTachometerAlt /></Link>
                    <Link to="/weather"><FaCloudSun /></Link>
                    <Link to={`/MandiPrices?district=${selectedDistrict}`}> <FaStore className="active" /></Link>
                    <Link to="/schemes"><FaLandmark /></Link>
                    <FaCog />
                </nav>
            </aside>

            <main className="content-area">
                <header className="search-section">
                    <select className="search-input" value={selectedDistrict} onChange={handleDistrictChange}>
                        {districts.map((district, idx) => (
                            <option key={idx} value={district}>{district}</option>
                        ))}
                    </select>
                </header>

                <section className="price-table-section">
                    <h2>Today's Prices for {selectedDistrict}</h2>
                    <div className="price-table">
                        <div className="table-header">
                            <span>Crop</span>
                            <span>Today's price</span>
                            <span>Yesterday's Price</span>
                            <span>Change</span>
                        </div>
                        <div className="table-rows">
                            {mandiData.map((item, idx) => {
                                const prices = item.Prices;
                                const today = prices["Jul 16"];
                                const yesterday = prices["Jul 15"];
                                const change = today - yesterday;
                                const changeClass = change > 0 ? "green" : change < 0 ? "red" : "gray";
                                return (
                                    <div key={idx} className="table-row">
                                        <span className="crop-name">{item.Commodity} ({item.Variety})</span>
                                        <span>₹{today}</span>
                                        <span>₹{yesterday}</span>
                                        <span className={changeClass}>{change > 0 ? '+' : ''}{change}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="price-trend-section">
                    <div className="trend-card">
                        <h3>Price Trend (last 7 days)</h3>
                        {mandiData.length > 0 ? (
                            <div style={{ height: '120px' }}>
                                <Line
                                    data={{
                                        labels: Object.keys(mandiData[0].Prices),
                                        datasets: [
                                            {
                                                label: mandiData[0].Commodity + ' (' + mandiData[0].Variety + ')',
                                                data: Object.values(mandiData[0].Prices),
                                                borderColor: '#2e4e46',
                                                backgroundColor: 'rgba(46, 78, 70, 0.2)',
                                                fill: true,
                                                tension: 0.3,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: false,
                                                ticks: {
                                                    callback: (val) => `₹${val}`,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        ) : (
                            <p>Loading chart...</p>
                        )}
                    </div>

                    <div className="tips-card">
  {mandiData.length > 0 ? (
    <p>{getCropTip(mandiData[0].Commodity)}</p>
  ) : (
    <p>Loading tips...</p>
  )}
</div>

                </section>

            </main>
        </div>
    );
};

export default MandiPrices;
