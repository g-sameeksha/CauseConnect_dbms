import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import BarChart from "../charts/BarChart";
import LineChart from "../charts/LineChart";

const DonorHome = () => {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [counts, setCounts] = useState({});
  const [donationsPerMonth, setDonationsPerMonth] = useState({});
  const [donationsPerCause, setNewDonationsPerCause] = useState({});
  const [recentDonations,setRecentDonations] = useState([]);
 

  useEffect(() => {
    const fetchDonorStats = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/donor-stats/",
          { email: user.email }, // Send email as data
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
              "Content-Type": "application/json",
            },
          }
        );
        

        setCounts({
          total_donations: response.data.total_donations,
          total_donated: response.data.total_donated,
          causes_supported: response.data.causes_supported,
        });
        setRecentDonations(response.data.last_5_donations)

        setNewDonationsPerCause({
          labels: response.data.donations_per_cause?.map(item => item.cause__title) || [],
          datasets: [{
            label: "Donations Per Cause",
            data: response.data.donations_per_cause?.map(item => item.total_amount) || [],
            backgroundColor: ["#168d8f", "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
            borderColor: "#ffffff",
            borderWidth: 1,
           
          }],
        });
        
        setDonationsPerMonth({
          labels: response.data.monthly_donations?.map(item => item.month) || [],
          datasets: [
            {
              label: "Total Donation Amount",
              data: response.data.monthly_donations?.map(item => item.total_amount) || [],
              backgroundColor: "#168d8f",
              borderColor: "#ffffff",
              borderWidth: 1,
            
            },
            {
              label: "Number of Donations",
              data: response.data.monthly_donations?.map(item => item.donation_count) || [],
              backgroundColor: "#f4a261",
              borderColor: "#ffffff",
              borderWidth: 1,
            
            }
          ],
        });
        
    

      }catch (error) {
        console.error("Error fetching donation stats:", error);
      }
    }

        
    fetchDonorStats();
  }, [user.email]);

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-white">Donor Dashboard</h2>

        {/* Stats Cards */}
        <div className="row mb-5 mt-5">
          <div className="col-md-4">
            <div className="card text-white bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Donations made</h5>
                <p className="card-text">{counts.total_donations}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Donated</h5>
                <p className="card-text">${counts.total_donated}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-info mb-3">
              <div className="card-body">
                <h5 className="card-title">Causes Supported</h5>
                <p className="card-text">{counts.causes_supported}</p>
              </div>
            </div>
          </div>
        </div>

        <hr />

        {/* Last 5 Donations Table */}
        <h3 className="mt-4 mb-4 text-secondary">Recent Donations</h3>
        <ul className="list-group">
          {recentDonations.length === 0 ? (
            <li className="list-group-item">No donations made yet.</li>
          ) : (
            recentDonations.map((donation, index) => (
              <li key={index} className="list-group-item">
                <strong>{donation.cause__title}</strong> - Donated $
                {donation.amount} on{" "}
                {new Date(donation.date).toLocaleDateString()}
              </li>
            ))
          )}
        </ul>

        <hr />

        {/* Charts Section */}
        <div className="dashboard-container" style={{ margin: "auto" }}>
          <h1 className="text-center">Donations Overview</h1>

          {/* Donations Per Cause Chart */}
          <div
            className="chart-container border my-5"
            style={{
              width: "90%",
              margin: "auto",
              paddingBottom: "4.5rem",
              paddingTop: "1rem",
            }}
          >
            <BarChart
              chartData={donationsPerCause}
              title="Donated Amount($) per Cause"
            />
          </div>


           {/* Charts */}
      \
        <div 
        className="chart-container border my-5"
        style={{
          width: "90%",
          margin: "auto",
          paddingBottom: "4.5rem",
          paddingTop: "1rem",
        }}
        >
          <LineChart chartData={donationsPerMonth} title="Donations Per Month" />
        </div>

       
    
        </div>
      </div>
    </>
  );
};

export default DonorHome;
