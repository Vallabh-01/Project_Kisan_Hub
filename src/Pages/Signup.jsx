import React from "react";
import "./Signup.css";
import logo from "../assets/Hd Logo normal.png";
import bgImage from "../assets/floral.jpg";

const Signup = () => {
    return (
        <div
            className="signup-page"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="signup-form-container">
                <img src={logo} alt="Logo" className="signup-logo" />
                <h2>
                    🌾 <span>Create Your Account</span>
                </h2>

                <form className="signup-form">
                    <input type="text" placeholder="Full Name" />
                    <input type="tel" placeholder="Mobile Number" />
                    <input type="password" placeholder="Password" />
                    <input type="password" placeholder="Confirm Password" />

                    <button type="submit">Create My Account</button>
                    <p className="login-link">Already registered? <a href="/login">Login here</a></p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
