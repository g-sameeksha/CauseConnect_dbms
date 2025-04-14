import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Spinner, Button, Badge } from "react-bootstrap";
import { FaUser, FaBuilding, FaHandHoldingHeart } from "react-icons/fa";
import "./AdminProfile.css";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [organizationData, setOrganizationData] = useState(null);
  const [causes, setCauses] = useState([]);
  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin_profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });

      const { admin, organization, causes } = response.data;
      setAdminData(admin);
      setOrganizationData(organization);
      setCauses(causes);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  const updateCauseStatus = async (causeId, newStatus) => {
    try {
      await axios.patch(
        `${BASE_URL}/update_cause_status/${causeId}/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        }
      );
      
      setCauses((prevCauses) =>
        prevCauses.map((cause) =>
          cause.cause_id === causeId ? { ...cause, status: newStatus } : cause
        )
      );
    } catch (error) {
      console.error("Error updating cause status:", error);
    }
  };

  if (!adminData || !organizationData) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="light" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      <div className="info-section">
        <Card className="info-card">
          <Card.Body>
            <h5><FaBuilding className="me-2" /> Organization Details</h5>
            <hr />
            <div className="text-center">
              <img src={`${BASE_URL}/${organizationData.image}`} className="organization-img" alt="Organization" />
            </div>
            <div className="table-responsive">
              <table className="custom-table text-white mt-3">
                <tbody>
                  <tr><td>Name:</td><td>{organizationData.name}</td></tr>
                  <tr><td>About:</td><td>{organizationData.about}</td></tr>
                  <tr><td>Email:</td><td>{organizationData.email}</td></tr>
                  <tr><td>Phone:</td><td>{organizationData.phone_number}</td></tr>
                  <tr><td>Address:</td><td>{organizationData.address}</td></tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>

        <Card className="info-card">
          <Card.Body>
            <h5><FaUser className="me-2" /> Admin Details</h5>
            <hr />
            <p><strong>Name:</strong> {adminData.first_name} {adminData.last_name}</p>
            <p><strong>Email:</strong> {adminData.email}</p>
            <p><strong>Role:</strong> {adminData.role ? adminData.role.toUpperCase() : "N/A"}</p>
          </Card.Body>
        </Card>
      </div>

      <hr />

      <Card className="causes-card">
        <Card.Body>
          <h5><FaHandHoldingHeart className="me-2" /> Causes Raised by Organization</h5>
          <hr />
          {causes.length === 0 ? (
            <p className="text-muted">No causes have been raised yet.</p>
          ) : (
            <ul className="list-group">
              {causes.map((cause) => (
                <li key={cause.cause_id} className="list-group-item cause-item">
                  <div className="cause-details">
                    <h4>{cause.title}</h4>
                    <p className="text-muted">{cause.description}</p>
                    <p><strong>Status:</strong> <Badge bg={cause.status === "active" ? "success" : cause.status === "stopped" ? "danger" : "warning"}>{cause.status ? cause.status.toUpperCase() : "UNKNOWN"}</Badge></p>
                  </div>
                  <div className="cause-amounts">
                    <p>Target: ${cause.target_amount}</p>
                    <p>Raised: ${cause.raised_amount}</p>
                  </div>
                  <div className="cause-actions">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => updateCauseStatus(cause.cause_id, "active")}
                    disabled={cause.status === "active" || cause.status === "stopped"}
                  >
                    Activate
                  </Button>
                  
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => updateCauseStatus(cause.cause_id, "inactive")}
                    disabled={cause.status === "inactive" || cause.status === "stopped"}
                  >
                    Deactivate
                  </Button>
                  
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => updateCauseStatus(cause.cause_id, "stopped")}
                    disabled={cause.status === "stopped"}
                  >
                    Stop Receiving
                  </Button>
                </div>
                </li>
              ))}
            </ul>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminProfile;