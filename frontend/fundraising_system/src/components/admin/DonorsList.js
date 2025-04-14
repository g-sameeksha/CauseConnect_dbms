import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const DonorsList = () => {
  // const location = useLocation();
  // const [donors, setDonors] = useState(location.state?.donors || []);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch admins if not available from props
  useEffect(() => {
    // if (donors.length === 0) {
    //   fetchDonors();
    // }
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access"); // Get auth token
      const response = await axios.get("http://127.0.0.1:8000/admin_get_lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonors(response.data.donors); // Set admins from API
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Failed to fetch donors.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Donors List</h2>

      {loading ? (
        <p className="text-center">Loading donors...</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>Place</th>
            </tr>
          </thead>
          <tbody>
           
            {donors.length > 0 ? (
              donors.map((donor) => (
                <tr key={donor.donor_id}>
                  <td>{donor.donor_id}</td>
                  <td>{donor.user.first_name} {donor.user.last_name}</td>
                  <td>{donor.user.email}</td>
                  <td>{donor.user.phone_number}</td>
                  <td>{donor.dob}</td>
                  <td>{donor.city} , {donor.state} , {donor.country}</td>
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No Admins Found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DonorsList;
