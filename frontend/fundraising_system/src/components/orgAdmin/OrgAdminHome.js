import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import BarChart from "../charts/BarChart";
import PieChart from "../charts/PieChart";
import LineChart from "../charts/LineChart";
import { AuthContext } from "../../context/AuthContext";

const OrgAdminHome = () => {
  const [counts, setCounts] = useState({
    total_donations: 0,
    total_donors: 0,
    active_causes: 0,
  });

  const { smallMultiplier, bigMultiplier } = useContext(AuthContext);

  const [recentDonations, setRecentDonations] = useState([]);
  const [donationsPerCauseChart, setDonationsPerCauseChart] = useState({});
  const [causeFundingChart, setCauseFundingChart] = useState({});
  const [donationsPerDayChart, setDonationsPerDayChart] = useState({});

  // New state for date range filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/org_admin_dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((response) => {
        const data = response.data;

        setCounts({
          total_donations: data.total_donations,
          total_donors: data.total_donors,
          active_causes: data.active_causes,
        });

        setRecentDonations(data.recent_donations);

        // Format donations per day
        const formattedDonations = data.donations_per_day.map((item) => ({
          ...item,
          formattedDate: new Date(item.day).toISOString().split("T")[0], // Convert to YYYY-MM-DD
        }));

        // Filter donations based on selected date range
        const filteredDonations = formattedDonations.filter((item) => {
          if (startDate && endDate) {
            return item.formattedDate >= startDate && item.formattedDate <= endDate;
          }
          return true; // If no date is selected, show all data
        });

        setDonationsPerDayChart({
          labels: filteredDonations.map((item) =>
            new Date(item.day).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          ),
          datasets: [
            {
              label: "Donation Count",
              data: filteredDonations.map((item) => item.donation_count * smallMultiplier),
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
            },
            {
              label: "Total Raised",
              data: filteredDonations.map((item) => item.total_raised * bigMultiplier),
              borderColor: "rgb(147, 192, 75)",
              backgroundColor: "rgba(75,192,192,0.2)",
            },
          ],
        });

        // Bar Chart: Cause Funding
        setCauseFundingChart({
          labels: data.cause_funding.map((item) => item.title),
          datasets: [
            {
              label: "Target Amount",
              data: data.cause_funding.map((item) => item.target_amount),
              backgroundColor: "rgba(255, 99, 132, 0.7)",
            },
            {
              label: "Raised Amount",
              data: data.cause_funding.map((item) => item.raised_amount * bigMultiplier),
              backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
          ],
        });

        // Pie Chart: Donations Per Cause
        setDonationsPerCauseChart({
          labels: data.donations_per_cause.map((item) => item.title),
          datasets: [
            {
              label: "Donation Count",
              data: data.donations_per_cause.map((item) => item.donation_count * smallMultiplier),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching dashboard data", error));
  }, [startDate, endDate]); // Re-run when date range changes

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Organization Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="row text-center">
        <div className="col-md-4">
          <div className="card bg-dark text-white shadow border-white">
            <div className="card-body">
              <h5>Total Donations</h5>
              <p className="display-4 text-warning">${counts.total_donations * bigMultiplier}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark text-white shadow border-white">
            <div className="card-body">
              <h5>Total Donors</h5>
              <p className="display-4 text-warning">{counts.total_donors * smallMultiplier}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark text-white shadow border-white">
            <div className="card-body">
              <h5>Active Causes</h5>
              <p className="display-4 text-warning">{counts.active_causes * smallMultiplier}</p>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Recent Donations */}
      <h3 className="mt-4 mb-4 text-secondary">Recent Donations</h3>
      <ul className="list-group w-50">
        {recentDonations.length === 0 ? (
          <li className="list-group-item">No donations made yet.</li>
        ) : (
          recentDonations.map((donation, index) => (
            <li key={index} className="list-group-item">
              <strong>{donation.donor}</strong> - Donated ${donation.amount * bigMultiplier} on{" "}
              {new Date(donation.date).toLocaleDateString()}
            </li>
          ))
        )}
      </ul>

      <hr />

      

      {/* Line Chart: Donations Per Day */}
      <div className="row my-5">

        {/* Date Filter Inputs */}
      <div className="row mb-4 w-75 date-range">
        <div className="col-md-4 ">
          <label className="text-white">Start Date:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="text-white">End Date:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

        <div className="col">
          <LineChart chartData={donationsPerDayChart} title="Donations Per Day" />
        </div>
      </div>

      <hr />

      {/* Pie Chart: Donations Per Cause */}
      <div className="row my-5"> 
        
        <div className="col">
          <PieChart chartData={donationsPerCauseChart} title="Donations Per Cause" />
        </div>
      </div>

      <hr />

      {/* Bar Chart: Cause Funding */}
      <div className="row my-4 mb-5">
        <div className="col">
          <BarChart chartData={causeFundingChart} title="Cause Funding (Target vs Raised)" />
        </div>
      </div>

      <hr />
    </div>
  );
};

export default OrgAdminHome;
