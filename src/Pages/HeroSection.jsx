import React from 'react'
import bgImage from "../assets/Hero_Page_Bg.png";
import "./HeroSection.css";

function HeroSection() {
    return (
        <div
            className="Hero-page"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="hero-content">
                <h1>Track. Plan. Grow.</h1>
                <p>One Dashboard All your Answers..</p>
                <a href="/dashboard" className="cta-button">Enter My Kisan Hub</a>
            </div>
        </div>
    );
}

export default HeroSection;