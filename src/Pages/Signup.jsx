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
        fullName: "",
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
            // 1. Create user with email & password
            const userCredential = await createUserWithEmailAndPassword(auth, fakeEmail, formData.password);
            const user = userCredential.user;

            // 2. Save user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: formData.fullName,
                phone: formData.phone,
                createdAt: new Date()
            });

            // 3. Success message and reset form
            setMessage("✅ Account created successfully!");
            setFormData({
                fullName: "",
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
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
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
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
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
