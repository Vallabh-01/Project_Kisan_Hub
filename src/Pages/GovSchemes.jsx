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
        // Flatten both central and state schemes into one array
        const combined = [];
        govSchemesData.government_schemes.forEach(group => {
            group.schemes.forEach(scheme => {
                combined.push({
                    ...scheme,
                    type: group.scheme_type
                });
            });
        });
        setSchemes(combined.slice(0, 6)); // show only first 6
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(
                    `https://newsapi.org/v2/everything?q=agriculture+India+schemes&language=en&sortBy=publishedAt&pageSize=5&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
                );
                const articles = response.data.articles.map(article => ({
                    title: article.title,
                    url: article.url,
                    source: article.source.name,
                }));
                setLiveNews(articles);
            } catch (err) {
                console.error('Error fetching agri news:', err);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentNewsIndex(prev =>
                prev === liveNews.length - 1 ? 0 : prev + 1
            );
        }, 4000); // 4 seconds

        return () => clearInterval(interval);
    }, [liveNews]);

    return (
        <div className="gov-container">
            {/* Sidebar */}
            <aside className="gov-sidebar">
                <div className="gov-logo">
                    <img src="src/assets/Hd Logo normal.png" alt="Logo" className="logo-img" />
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
                    <h2>Related News</h2>
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
                            <p>Loading agri news...</p>
                        )}
                    </div>


                </section>
            </main>
        </div>
    );
};

export default GovSchemes;
