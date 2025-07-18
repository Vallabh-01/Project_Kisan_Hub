import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Dashboard from "./Pages/Dashboard";
import Weather from "./Pages/Weather";

function App() {
  return (
   <Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/weather" element={<Weather />} />
</Routes>
  );
}

export default App;
