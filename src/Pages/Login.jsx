import React from "react";
import "./Login.css";
import logo from "../assets/Hd Logo normal.png";
import bgImage from "../assets/floral.jpg";

const Login = () => {
    return (
        <div
            className="login-page"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="login-form-container">
                <img src={logo} alt="Logo" className="login-logo" />
                <h2>
                   <span>Welcome Back,Kisan!</span>
                </h2>

                <form className="login-form">
                    <input type="username" placeholder="Username or Mobile Number" />
                    <input type="password" placeholder="Password" />

                    <button type="submit">Login ↠</button>
                    <p className="login-link">New Here? <a href="/signup">Signup Now</a></p>
                </form>
            </div>
        </div>
    );
};

export default Login;
