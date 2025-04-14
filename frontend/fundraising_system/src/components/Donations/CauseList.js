import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CauseList.css";

const CauseList = () => {
  const [causes, setCauses] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/get_causes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((response) => setCauses(response.data.causes))
      .catch((error) => console.error("Error fetching causes:", error));
  }, []);

  return (
    <div className="container">
      <h2 className="text-center title">Active Causes</h2>
      <hr className="text-white"></hr>
      <div className="cause-grid">
        {causes.length === 0 ? (
          <p className="text-center text-muted">No active causes at the moment.</p>
        ) : (
          causes.map((cause) => (
            <div key={cause.cause_id} className="donate-cause-card">
              <img
                src={`${BASE_URL}/media/${cause.image}`}
                className="cause-image"
                alt={cause.title}
              />
              <div className="cause-content">
                <h5 className="card-title">{cause.title}</h5>
                <p className="card-text">{cause.description.substring(0, 40)}...</p>
                <p className="cause-details">
                  <strong>🎯 Target:</strong> ${cause.target_amount}  
                  <br />
                  <strong>💰 Raised:</strong> ${cause.raised_amount || 0}
                </p>
                <button
                  className="btn gradient-button"
                  onClick={() => navigate(`/cause/${cause.cause_id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CauseList;
