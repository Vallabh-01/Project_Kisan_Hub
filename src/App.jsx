import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Dashboard from "./Pages/Dashboard";
import Weather from "./Pages/Weather";
import MandiPrices from "./Pages/MandiPrices";
import GovSchemes from "./Pages/GovSchemes";
import Signup from './Pages/Signup';
import Login from "./Pages/Login";
import HeroSection from "./Pages/HeroSection";
import UserProfile from "./Pages/UserProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/MandiPrices" element={<MandiPrices />} />
      <Route path="/GovSchemes" element={<GovSchemes />} />
      <Route path="/userprofile" element={<UserProfile/>} />
    </Routes>
  );
}

export default App;
