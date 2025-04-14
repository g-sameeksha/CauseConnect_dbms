import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CauseDetail.css"; // Ensure this file is properly linked

const CauseDetail = () => {
  const { cause_id } = useParams(); // Extracts cause_id from the URL
  const [cause, setCause] = useState(null);
  const navigate = useNavigate(); // Hook for navigation
  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/get_cause/${cause_id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((response) => setCause(response.data))
      .catch((error) => console.error("Error fetching cause details:", error));
  }, [cause_id]);

  if (!cause) return <p className="text-center">Loading...</p>;

  const handleDonate = () => {
    navigate("/donor/donate", {
      state: {
        cause_id: cause.cause_id,
        cause_name: cause.title,
        organization_id: cause.organization.registration_number,
        organization_name: cause.organization.name,
      },
    });
  };

  return (
    <div className="cause-detail-container">
      <h1>{cause.title}</h1>
      <hr />

      <div className="cause-detail-section">
        <img
          src={`${BASE_URL}/${cause.image}`}
          className="cause-detail-image"
          alt="Cause"
        />
        <p>{cause.description}</p>
        <p>
          <strong>Organization:</strong>{" "}
          <span style={{ color: "orange" }}>{cause.organization.name}</span>
        </p>
        <p>
          <strong>Target Amount:</strong>{" "}
          <span style={{ color: "orange" }}>${cause.target_amount}</span>
        </p>
        <p>
          <strong>Raised Amount:</strong>{" "}
          <span style={{ color: "orange" }}>${cause.raised_amount}</span>
        </p>
      </div>

      <button className="btn gradient-button w-75" onClick={handleDonate}>
        Donate Now
      </button>
    </div>
  );
};

export default CauseDetail;
