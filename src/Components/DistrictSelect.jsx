import React from "react";

const DistrictSelect = ({ districts, selectedDistrict, onChange, className = "" }) => (
  <select
    className={`search-input ${className}`}
    value={selectedDistrict}
    onChange={onChange}
  >
    {districts.map((district, idx) => (
      <option key={idx} value={district}>
        {district}
      </option>
    ))}
  </select>
);

export default DistrictSelect;