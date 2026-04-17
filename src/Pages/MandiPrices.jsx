// MandiPrices.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MandiPrices.css";
import { Filler } from "chart.js";
import logo from "../assets/logo_only.png";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import DistrictSelect from "../Components/DistrictSelect";
import { useLocationContext } from "../context/LocationContext";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler
);

const MandiPrices = () => {
    const [mandiData, setMandiData] = useState([]);
    const [tips, setTips] = useState({});
    useEffect(() => {
        fetch("/data/tips.json")
            .then((res) => res.json())
            .then((data) => setTips(data))
            .catch((err) => console.error("Error loading tips:", err));
    }, []);

    const getCropTip = (commodity) => {
        const key = commodity?.toLowerCase();
        return tips[key] || "Follow best practices to increase yield.";
    };

    // fetch data from local JSON file and extract unique districts for dropdown, also filter mandi data based on selected district

    const [districts, setDistricts] = useState([]);
    const { district, setDistrict } = useLocationContext();
    useEffect(() => {
        fetch("/data/maharashtra-mandi-full.json")
            .then((res) => res.json())
            .then((data) => {
                const uniqueDistricts = [
                    ...new Set(data.map((entry) => entry.District)),
                ];
                setDistricts(uniqueDistricts);

                if (!district) return;

                const filtered = data.filter(
                    (entry) =>
                        entry.District.toLowerCase() === district.toLowerCase()
                );
                setMandiData(filtered.slice(0, 6));
            })
            .catch((err) => console.error("Error loading mandi data:", err));
    }, [district]);

    return (
        <div className="mandi-container">
            <aside className="Mandi-sidebar">
                <div className="Mandi-logo">
                    <img src={logo} alt="Logo" className="logo-img" />
                </div>
                <nav className="Mandi-icons">
                    <Link to="/dashboard" data-label="Dashboard">
                        <FaTachometerAlt />
                    </Link>
                    <Link to="/weather" data-label="Weather">
                        <FaCloudSun />
                    </Link>
                    <Link to="/MandiPrices">
                        {" "}
                        <FaStore className="active" data-label="Mandi Prices" />
                    </Link>
                    <Link to="/GovSchemes" data-label="Schemes">
                        <FaLandmark />
                    </Link>
                    <Link to="/userprofile" data-label="Profile">
                        <FaCog />
                    </Link>
                </nav>
            </aside>

            <main className="content-area">
                <header className="search-section">
                    <DistrictSelect
                        districts={districts}
                        selectedDistrict={district}
                        onChange={(e) => setDistrict(e.target.value)}
                    />
                </header>

                <section className="price-table-section">
                    <h2>Today's Prices for {district}</h2>
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
                                const dates = Object.keys(prices);
                                const today = prices[dates[dates.length - 1]];
                                const yesterday = prices[dates[dates.length - 2]];
                                const change = today - yesterday;
                                const changeClass =
                                    change > 0 ? "green" : change < 0 ? "red" : "gray";
                                return (
                                    <div key={idx} className="table-row">
                                        <span className="crop-name">
                                            {item.Commodity} ({item.Variety})
                                        </span>
                                        <span>₹{today}</span>
                                        <span>₹{yesterday}</span>
                                        <span className={changeClass}>
                                            {change > 0 ? "+" : ""}
                                            {change}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Shows Graph of the mandi prices */}
                <section className="price-trend-section">
                    <div className="trend-card">
                        <h3>Price Trend (last 7 days)</h3>
                        {mandiData.length > 0 ? (
                            <div style={{ height: "120px" }}>
                                <Line
                                    data={{
                                        labels: Object.keys(mandiData[0].Prices),
                                        datasets: [
                                            {
                                                label:
                                                    mandiData[0].Commodity +
                                                    " (" +
                                                    mandiData[0].Variety +
                                                    ")",
                                                data: Object.values(mandiData[0].Prices),
                                                borderColor: "#2e4e46",
                                                backgroundColor: "rgba(46, 78, 70, 0.2)",
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
