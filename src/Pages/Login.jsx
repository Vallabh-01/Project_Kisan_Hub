import React, { useState } from "react";
import "./Login.css";
import logo from "../assets/Hd Logo normal.png";
import bgImage from "../assets/floral.jpg";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!phone || !password) {
      setError("Please fill in both fields.");
      return;
    }

    const fakeEmail = `${phone}@kisanhub.com`;

    try {
      await signInWithEmailAndPassword(auth, fakeEmail, password);
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/dashboard"), 2000); // redirect to homepage or dashboard
    } catch (err) {
      if (err.code === "auth/network-request-failed") {
        setError("⚠️ Network error. Please check your internet connection.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-form-container">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2><span>Welcome Back, Kisan!</span></h2>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login ↠</button>
          {error && <p className="error-msg">{error}</p>}
          {message && <p className="success-msg">{message}</p>}
          <p className="signup-link">New Here? <a href="/signup">Signup Now</a></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
