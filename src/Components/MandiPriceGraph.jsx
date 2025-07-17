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
import mandiData from "../Data/maharashtra-mandi-full.json";

const MandiPriceGraph = ({ district }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const entries = mandiData.filter(
      (item) => item.District?.toLowerCase() === district.toLowerCase()
    );

    if (!entries || entries.length === 0) {
      setChartData([]);
      return;
    }

    const first = entries[0];

    if (!first || !first.Prices) {
      setChartData([]);
      return;
    }

    const prices = Object.entries(first.Prices)
      .map(([date, price]) => ({
        date,
        price: parseFloat(price),
      }))
      .filter((d) => !isNaN(d.price));

    setChartData(prices);
  }, [district]);

  // Dynamic Y-axis padding
  const priceValues = chartData.map((d) => d.price);
  const min = Math.min(...priceValues);
  const max = Math.max(...priceValues);
  const padding = 5;

  return (
    <div className="card large" style={{ padding: "1rem", boxSizing: "border-box" }}>
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
        <p style={{ padding: "1rem" }}>No data available for this selection.</p>
      )}
    </div>
  );
};

export default MandiPriceGraph;
