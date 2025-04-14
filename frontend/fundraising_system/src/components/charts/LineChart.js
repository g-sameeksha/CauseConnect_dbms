import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

// Register chart components along with the Filler plugin
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ chartData, title }) => {
  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return <p style={{ textAlign: "center", color: "white" }}>No data available</p>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { color: "rgba(255, 255, 255, 0.2)" }, ticks: { color: "white" } },
      y: { grid: { color: "rgba(255, 255, 255, 0.2)" }, ticks: { color: "white" } },
    },
  };

  return (
    <div style={{ width: "80%", height: "300px", margin: "auto"}}>
      <h2 style={{ textAlign: "center", color: "white" }}>{title}</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
