import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MandiPriceGraph = ({ district }) => {
  const [chartData, setChartData] = useState([]);
  const [mandiData, setMandiData] = useState([]);

  // Load mandi data from public JSON
  useEffect(() => {
    const loadMandiData = async () => {
      try {
        const res = await fetch("/data/maharashtra-mandi-full.json");

        if (!res.ok) {
          throw new Error("Failed to fetch mandi data");
        }

        const data = await res.json();
        setMandiData(data);
      } catch (err) {
        console.error("Error loading mandi data:", err);
      }
    };

    loadMandiData();
  }, []);

  // Prepare chart data when district changes
  useEffect(() => {
    if (!district || mandiData.length === 0) {
      setChartData([]);
      return;
    }

    const entries = mandiData.filter(
      (item) =>
        item.District &&
        item.District.toLowerCase() === district.toLowerCase()
    );

    if (!entries.length) {
      setChartData([]);
      return;
    }

    const firstEntry = entries[0];

    if (!firstEntry || !firstEntry.Prices) {
      setChartData([]);
      return;
    }

    const prices = Object.entries(firstEntry.Prices)
      .map(([date, price]) => ({
        date,
        price: parseFloat(price),
      }))
      .filter((d) => !isNaN(d.price));

    setChartData(prices);
  }, [district, mandiData]);

  // Safe Y-axis calculation
  const priceValues = chartData.map((d) => d.price);
  const min = priceValues.length ? Math.min(...priceValues) : 0;
  const max = priceValues.length ? Math.max(...priceValues) : 0;
  const padding = 5;

  return (
    <div
      className="card large"
      style={{ padding: "1rem", boxSizing: "border-box" }}
    >
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis
              domain={[
                min - padding < 0 ? 0 : min - padding,
                max + padding,
              ]}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#3A635B"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ padding: "1rem" }}>
          No data available for this selection.
        </p>
      )}
    </div>
  );
};

export default MandiPriceGraph;