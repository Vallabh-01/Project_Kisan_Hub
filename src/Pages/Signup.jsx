import React, { useState } from "react";
import "./Signup.css";
import logo from "../assets/Hd Logo normal.png";
import bgImage from "../assets/floral.jpg";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const fakeEmail = `${formData.phone}@kisanhub.com`;

    try {
      // Create user with email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        fakeEmail,
        formData.password
      );
      const user = userCredential.user;

      // Save only common data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: fakeEmail,
      });

      setMessage("✅ Account created successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="signup-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="signup-form-container">
        <img src={logo} alt="Logo" className="signup-logo" />
        <h2>🌾 <span>Create Your Account</span></h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Create My Account</button>
          {error && <p className="error-msg">{error}</p>}
          {message && <p className="success-msg">{message}</p>}
          <p className="login-link">Already registered? <a href="/login">Login here</a></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
