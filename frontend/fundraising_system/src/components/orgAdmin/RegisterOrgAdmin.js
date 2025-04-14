import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RegisterOrgAdmin = ({ selectedOrg, setSelectedOrg }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/get_organizations")
      .then((res) => setOrganizations(res.data.organizations))
      .catch(() => setError("Failed to load organizations."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading organizations...</p>
      ) : (
        <>
          {organizations.length === 0 ? (
            <div className="alert alert-warning text-center">
              <strong>No organization registered yet.</strong> <br />
              <Link to="/register-organization" className="text-primary">
                Register an organization first.
              </Link>
            </div>
          ) : (
            <>
              <label className="form-label">Select Organization:</label>
              <select 
                className="form-select mb-2" 
                value={selectedOrg} 
                onChange={(e) => setSelectedOrg(e.target.value)} 
                required
              >
                <option value="">Select an organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.registration_number}>
                    {org.name}
                  </option>
                ))}
              </select>

              {!selectedOrg && ( // Only show the link if no organization is selected
                <p className="mt-2">
                  <Link to="/register-organization" style={{"color":"darkgrey"}}>
                    + Register Organization
                  </Link>
                </p>
              )}
            </>
          )}
        </>
      )}
      {error && <div className="alert alert-danger small mt-2">{error}</div>}
    </div>
  );
};

export default RegisterOrgAdmin;
