/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [district, setDistrict] = useState("Pune"); // default district is set to pune.

  return (
    <LocationContext.Provider value={{ district, setDistrict }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
