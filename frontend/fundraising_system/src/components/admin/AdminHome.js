import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import LineChart from "../charts/LineChart";
import PieChart from "../charts/PieChart";
import BarChart from "../charts/BarChart";

const AdminHome = () => {
  const [counts, setCounts] = useState({});
  const [donationsPerDay, setDonationsPerDay] = useState({});
  const [newDonorsPerMonth, setNewDonorsPerMonth] = useState({});
  const [orgCauses, setOrgCauses] = useState({});
  const [raisedAmountPerCause, setRaisedAmountPerCause] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("http://127.0.0.1:8000/admin_dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data); // Debugging

      setCounts({
        total_donors: response.data.total_donors,
        total_organizations: response.data.total_organizations,
        total_org_admins: response.data.total_org_admins,
        total_donations: response.data.total_donations,
        total_causes: response.data.total_causes,
      });

      
  
      // Donations Per Day
      const donationsData = response.data.donations_per_day || [];
      setDonationsPerDay({
        labels: donationsData.map(item => item.day),
        datasets: [
          {
            label: "Donations Per Day",
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
  
      // New Donors Per Month
      const newDonorsData = response.data.new_donors_per_month || [];
      setNewDonorsPerMonth({
        labels: newDonorsData.map(item => item.month),
        datasets: [
          {
            label: "New Donors Per Month",
            data: newDonorsData.map(item => item.count),
            borderColor: "#ff6384",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            pointBackgroundColor: "#ff6384",
            pointBorderColor: "white",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
          },
        ],
      });
  
      // Raised Amount Per Cause
      const raisedAmountData = response.data.raised_amount_per_cause || [];
      if (raisedAmountData.length > 0) {
        setRaisedAmountPerCause({
          labels: raisedAmountData.map(item => item.title),
          datasets: [
            {
              label: "Raised Amount Per Cause",
              data: raisedAmountData.map(item => item.raised_amount),
              backgroundColor: ["#168d8f", "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          ],
        });
      }
  
      // Causes Per Organization
      const orgCausesData = response.data.org_causes || [];
      if (orgCausesData.length > 0) {
        setOrgCauses({
          labels: orgCausesData.map(item => item.organization),
          datasets: [
            {
              label: "Causes Per Organization",
              data: orgCausesData.map(item => item.count),
              backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
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
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="row text-center">
        {Object.entries(counts).map(([key, value]) => (
          <div className="col-md-4" key={key}>
            <div className="card text-white bg-dark mb-3 shadow-white border-white">
              <div className="card-body">
                <h5 className="card-title ">{ key.replace("_"," ")}</h5>
                <p className="card-text display-4 text-warning" style={{"fontSize":"2rem"}}>{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr />

      {/* Charts */}
      <div className="row my- mb-5">
        <div className="col py-3">
          <LineChart chartData={donationsPerDay} title="Donations Per Day" />
        </div>

       
      </div>
      <hr></hr>

      <div className="row my-4 mb-5">
      <div className="col py-3">
          <LineChart chartData={newDonorsPerMonth} title="New Donors Per Month" />
        </div>
      </div>
      <hr></hr>
      
      <div className="row my-4 mb-5">
        <div className="col py-3">
          {raisedAmountPerCause.labels ? (
            <BarChart chartData={raisedAmountPerCause} title="Raised Amount Per Cause" />
          ) : (
            <p className="text-center text-white">No data available for Raised Amount Per Cause</p>
          )}
        </div>

    </div>

    <hr></hr>

        <div className="row my-5 mb-5 ">
        <div className="col py-3">
          {orgCauses.labels ? (
            <PieChart chartData={orgCauses} title="Causes Per Organization" />
          ) : (
            <p className="text-center text-white">No data available for Causes Per Organization</p>
          )}
        </div>
        </div>
        
      
      <hr></hr>
    </div>
  );
};

export default AdminHome;
