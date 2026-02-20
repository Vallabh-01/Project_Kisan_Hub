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

const MandiPriceGraph = ({ records }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!records || records.length === 0) {
      setChartData([]);
      return;
    }

    const formatted = records.map(item => ({
      date: item.arrival_date,
      price: parseFloat(item.modal_price)
    }))
    .filter(d => !isNaN(d.price));

    setChartData(formatted);

  }, [records]);

  const priceValues = chartData.map((d) => d.price);
  const min = Math.min(...priceValues);
  const max = Math.max(...priceValues);
  const padding = 5;

  return (
    <div className="card large" style={{ padding: "1rem" }}>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[min - padding, max + padding]} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#3A635B" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available for selected combination.</p>
      )}
    </div>
  );
};

export default MandiPriceGraph;