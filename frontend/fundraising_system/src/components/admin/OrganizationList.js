import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const OrganizationList = () => {
  // const location = useLocation();
  // const [organizations, setOrganizations] = useState(location.state?.organizations || []);
  const [organizations, setOrganizations] = useState([]);

  const [loading, setLoading] = useState(false);

  // ✅ Fetch organizations if not available from props
  useEffect(() => {
    // if (organizations.length === 0) {
    //   fetchOrganizations();
    // }
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access"); // Get auth token
      const response = await axios.get("http://127.0.0.1:8000/admin_get_lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrganizations(response.data.organizations); // Set organizations from API
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Failed to fetch organizations.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrganizationStatus = async (registrationNumber, status) => {
    try {
      const token = localStorage.getItem("access"); // Get auth token
      await axios.post(
        "http://127.0.0.1:8000/update_organization_status/",
        { registration_number: registrationNumber, status: status }, // ✅ Send as payload
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI after approval/rejection
      setOrganizations((prevOrgs) =>
        prevOrgs.map((org) =>
          org.registration_number === registrationNumber
            ? { ...org, approval_status: status === 1 ? "Approved" : "Rejected" }
            : org
        )
      );
      alert(status === 1 ? "Organization Approved!" : "Organization Rejected!");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update organization status.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Organizations List</h2>

      {loading ? (
        <p className="text-center">Loading organizations...</p>
      ) : (
        <div className=" table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
             
              <th>Name</th>
              <th>Registration Number</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.length > 0 ? (
              organizations.map((org) => (
                <tr key={org.organization_id}>
                 
                  <td>{org.name}</td>
                  <td>{org.registration_number}</td>
                  <td>{org.email}</td>
                  <td>{org.phone_number}</td>
                  <td>{org.address}</td>
                  <td
                    style={{
                      backgroundColor:
                        org.approval_status === "Approved" ? "green" :
                        org.approval_status === "Rejected" ? "red" : "orange",
                      color: "white",

                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {org.approval_status}
                  </td>
                  <td>
                    {org.approval_status === "pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm m-1"
                          onClick={() => updateOrganizationStatus(org.registration_number, 1)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm m-1"
                          onClick={() => updateOrganizationStatus(org.registration_number, 0)}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {org.approval_status != "pending" && "null"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No Organizations Found</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default OrganizationList;
