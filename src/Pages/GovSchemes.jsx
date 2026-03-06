import React, { useEffect, useState } from 'react';
import govSchemesData from '../Data/gov-schemes.json';
import { Link } from 'react-router-dom';
import './GovSchemes.css';
import axios from 'axios';
import {
    FaTachometerAlt,
    FaCloudSun,
    FaStore,
    FaLandmark,
    FaCog,
} from "react-icons/fa";

const GovSchemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [liveNews, setLiveNews] = useState([]);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

    useEffect(() => {
        // Flatten both central and state schemes into one array with type info, then take first 6 for display
        const combined = [];
        govSchemesData.government_schemes.forEach(group => {
            group.schemes.forEach(scheme => {
                combined.push({
                    ...scheme,
                    type: group.scheme_type
                });
            });
        });
        setSchemes(combined.slice(0, 6)); // show only first 6 schemes
    }, []);

    // API call to fetch live news related to government schemes and policies, with error handling and loading state
  useEffect(() => {
  const fetchNews = async () => {
    try {
      const response = await axios.get(
  "http://localhost:5000/api/scheme-news"
);

if (response.data.status === "success") {
  const articles = response.data.results.map(article => ({
    title: article.title,
    url: article.url,
    source: article.source.name,
    date: article.publishedAt,
  }));

  setLiveNews(articles.slice(0, 5));
}
    } catch (err) {
      console.error("Error fetching scheme news:", err);
    }
  };

  fetchNews();
}, []);

   // Auto-rotate news every 6 seconds, with cleanup to prevent memory leaks
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentNewsIndex(prev =>
                prev === liveNews.length - 1 ? 0 : prev + 1
            );
        }, 6000); // 6 seconds

        return () => clearInterval(interval);
    }, [liveNews]);

    return (
        <div className="gov-container">
            {/* Sidebar */}
            <aside className="gov-sidebar">
                <div className="gov-logo">
                    <img src="src/assets/logo_only.png" alt="Logo" className="logo-img" />
                </div>
                <nav className="gov-icons">
                    <Link to="/dashboard" data-label="Dashboard"><FaTachometerAlt /></Link>
                    <Link to="/weather" data-label="Weather"><FaCloudSun /></Link>
                    <Link to="/MandiPrices" data-label="Mandi Prices"><FaStore /></Link>
                    <Link to="/GovSchemes" data-label="Schemes"><FaLandmark className='active' /></Link>
                    <Link to="/userprofile" data-label="Profile"><FaCog /></Link>

                </nav>
            </aside>

            {/* Main Content */}
            <main className="gov-content">

                <section className="schemes-section">
                    <h2>Trending Schemes</h2>
                    <div className="schemes-grid">
                        {schemes.map((scheme, index) => (
                            <div key={index} className="scheme-card">
                                <h3>{scheme.name}</h3>
                                <p>{scheme.type}</p>
                                {scheme.link && (
                                    <a
                                        href={scheme.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="scheme-link"
                                    >
                                        Learn More →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="related-news-section">
                    <h2>Scheme & Policy Highlights</h2>
                    <div className="news-card">
                        {liveNews.length > 0 ? (
                            <a
                                href={liveNews[currentNewsIndex]?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-item"
                            >
                                📰 {liveNews[currentNewsIndex]?.title}
                                <br />
                                <small>({liveNews[currentNewsIndex]?.source})</small>
                            </a>
                        ) : (
                            <p>Loading News...</p>
                        )}
                    </div>

                </section>
            </main>
        </div>
    );
};

export default GovSchemes;
