import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const AdminsList = () => {
  // const location = useLocation();
  // const [admins, setAdmins] = useState(location.state?.admins || []);
  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(false);

  // // ✅ Fetch admins if not available from props
  // useEffect(() => {
  //   if (admins.length === 0) {
  //     fetchAdmins();
  //   }
  // }, []);

  useEffect(() => {
    
      fetchAdmins();
    
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access"); // Get auth token
      const response = await axios.get("http://127.0.0.1:8000/admin_get_lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data.admins); // Set admins from API
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Failed to fetch admins.");
    } finally {
      setLoading(false);
    }
  };

  const updateAdminStatus = async (adminId, status) => {
    try {
      const token = localStorage.getItem("access"); // Get auth token
      await axios.post(
        "http://127.0.0.1:8000/update_admin_status/",
        { admin_id: adminId, status: status }, // ✅ Send as payload
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI after approval/rejection
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.admin_id === adminId
            ? { ...admin, approval_status: status === 1 ? "Approved" : "Rejected" }
            : admin
        )
      );
      alert(status === 1 ? "Admin Approved!" : "Admin Rejected!");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update admin status.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4"> Organization Admins List</h2>

      {loading ? (
        <p className="text-center">Loading admins...</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Organization</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin.admin_id}>
                  <td>{admin.admin_id}</td>
                  <td>{admin.user.first_name} {admin.user.last_name}</td>
                  <td>{admin.user.email}</td>
                  <td>{admin.user.phone_number}</td>
                  <td>{admin.organization.name}</td>
                  <td
                    style={{
                      backgroundColor:
                        admin.approval_status === "Approved" ? "green" :
                        admin.approval_status === "Rejected" ? "red" : "#fff3cd",
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {admin.approval_status}
                  </td>
                  <td>
                    {admin.approval_status === "pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm m-1"
                          onClick={() => updateAdminStatus(admin.admin_id, 1)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm m-1"
                          onClick={() => updateAdminStatus(admin.admin_id, 0)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {admin.approval_status != "pending"  && "null"}
                  </td>
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

export default AdminsList;
