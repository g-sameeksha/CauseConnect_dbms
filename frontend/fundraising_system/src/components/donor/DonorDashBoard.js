import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import LineChart from "../charts/LineChart";
import PieChart from "../charts/PieChart";

const DonorHome = () => {
  const [counts, setCounts] = useState({});
  const [donationsPerMonth, setDonationsPerMonth] = useState({});
  const [donationsPerCause, setDonationsPerCause] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("http://127.0.0.1:8000/donor_dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data); // Debugging

      // Set Counts
      setCounts({
        total_donations: response.data.total_donations,
        total_amount_donated: response.data.total_amount_donated,
      });

      // Donations Per Month
      const donationsData = response.data.donations_per_month || [];
      setDonationsPerMonth({
        labels: donationsData.map(item => item.month),
        datasets: [
          {
            label: "Donations Per Month",
            data: donationsData.map(item => item.count),
            borderColor: "#168d8f",
            backgroundColor: "rgba(22, 141, 143, 0.2)",
            pointBackgroundColor: "#168d8f",
            pointBorderColor: "white",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
          },
        ],
      });

      // Donations Per Cause
      const causesData = response.data.donations_per_cause || [];
      if (causesData.length > 0) {
        setDonationsPerCause({
          labels: causesData.map(item => item.cause),
          datasets: [
            {
              label: "Donations Per Cause",
              data: causesData.map(item => item.count),
              backgroundColor: ["#168d8f", "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Donor Dashboard</h1>

      {/* Stats Cards */}
      <div className="row text-center">
        {Object.entries(counts).map(([key, value]) => (
          <div className="col-md-6" key={key}>
            <div className="card text-white bg-dark mb-3 shadow-white border-white">
              <div className="card-body">
                <h5 className="card-title">{key.replace("_", " ")}</h5>
                <p className="card-text display-4 text-warning" style={{ fontSize: "2rem" }}>
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr />

      {/* Charts */}
      <div className="row my-5 mb-5">
        <div className="col py-3">
          <LineChart chartData={donationsPerMonth} title="Donations Per Month" />
        </div>
      </div>
      <hr />

      <div className="row my-5 mb-5">
        <div className="col py-3">
          {donationsPerCause.labels ? (
            <PieChart chartData={donationsPerCause} title="Donations Per Cause" />
          ) : (
            <p className="text-center text-white">No data available for Donations Per Cause</p>
          )}
        </div>
      </div>

      <hr />
    </div>
  );
};

export default DonorHome;
