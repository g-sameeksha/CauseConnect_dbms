import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ chartData, title }) => {
  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return <p style={{ textAlign: "center", color: "white" }}>No data available</p>;
  }

  return (
    <div style={{ width: "90%", height: "350px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", color: "white", marginBottom: "2rem" }}>{title}</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
