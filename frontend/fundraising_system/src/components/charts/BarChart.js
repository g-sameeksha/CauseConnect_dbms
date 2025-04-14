import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ chartData, title }) => {
  console.log(chartData)
  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return <p style={{ textAlign: "center", color: "white" }}>No data available</p>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.2)" },
        ticks: { 
          color: "white", 
          font: { size: 14 }, 
          autoSkip: false,  // Prevent skipping labels
          maxRotation: 60,  // Rotate ticks to 45 degrees
          minRotation: 0  // Ensure consistent rotation
        } 
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.2)" },
        ticks: { color: "white", font: { size: 14 } } 
      }
    }
  };

  return (
    <div style={{ width: "90%", height: "350px", margin: "auto"}}>
      <h2 style={{ textAlign:"center", color: "white" }}>{title}</h2>
      <Bar 
        data={chartData} 
        options={options} 
      />
    </div>
  );
};

export default BarChart;
