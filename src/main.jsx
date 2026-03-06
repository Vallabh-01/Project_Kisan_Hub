import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LocationProvider } from "./context/LocationContext";
import "@progress/kendo-theme-default/dist/all.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocationProvider>
        <App />
      </LocationProvider>
    </BrowserRouter>
  </React.StrictMode>
);