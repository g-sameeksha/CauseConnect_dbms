import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrgBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    axios.get("http://localhost:3001/organizations") // Fetch organization data
      .then((response) => {
        const orgData = response.data;

        // Count organizations for each cause
        const causeCounts = {};
        orgData.forEach(org => {
          causeCounts[org.cause] = (causeCounts[org.cause] || 0) + 1;
        });

        // Convert to chart format
        const labels = Object.keys(causeCounts);
        const counts = Object.values(causeCounts);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Number of Organizations",
              data: counts,
              backgroundColor: ["#168d8f", "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
              borderColor: "white",
              borderWidth: 2,
              barThickness: 20 
            }
          ]
        });
      })
      .catch((error) => console.error("Error fetching organization data:", error));
  }, []);

  return (
    <div style={{ width: "80%", height: "350px", margin: "auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "white" }}>Organizations per Cause</h2>
      <Bar 
        data={chartData} 
        options={{ 
          responsive: true, 
          maintainAspectRatio: false, 
          scales: {
            x: { 
              grid: { color: "rgba(255, 255, 255, 0.2)" }, 
              ticks: { color: "white", font: { size: 14 } } 
            }, 
            y: { 
              grid: { color: "rgba(255, 255, 255, 0.2)" }, 
              ticks: { color: "white", font: { size: 14 } }
            }
          }
        }} 
      />
    </div>
  );
};

export default OrgBarChart;
