/* eslint-disable no-undef */
import axios from "axios";

let cachedData = []; // in-memory cache

export const loadAllMandiData = async () => {
  try {
    const apiKey = process.env.OGD_API_KEY;

    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&filters[state]=Maharashtra&limit=1300`;

    const response = await axios.get(url);

    cachedData = response.data.records || [];

    console.log("Mandi data loaded:", cachedData.length);

  } catch (error) {
    console.error("Initial load error:", error.message);
  }
};

export const getFilteredMandiData = (district, market, commodity) => {
  let filtered = cachedData;

  if (district)
    filtered = filtered.filter(r => r.district === district);

  if (market)
    filtered = filtered.filter(r => r.market === market);

  if (commodity)
    filtered = filtered.filter(r => r.commodity === commodity);

  return filtered;
};