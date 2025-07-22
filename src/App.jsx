import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Dashboard from "./Pages/Dashboard";
import Weather from "./Pages/Weather";
import MandiPrices from "./Pages/MandiPrices";
import GovSchemes from "./Pages/GovSchemes";
import Signup from './Pages/Signup';
import Login from "./Pages/Login";

function App() {
  return (
   <Routes>
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />

  <Route path="/" element={<Dashboard />} />
  <Route path="/weather" element={<Weather />} />
  <Route path="/MandiPrices" element={<MandiPrices />} />
  <Route path="/GovSchemes" element={<GovSchemes />} />
</Routes>
  );
}

export default App;
