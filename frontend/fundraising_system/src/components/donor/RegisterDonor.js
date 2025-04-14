// components/DonorForm.js
import React from "react";

const RegisterDonor = ({ donorData, setDonorData }) => {
  return (
    <>
      <div className="mb-3">
        <label className="form-label fw-semibold">City:</label>
        <input
          type="text"
          className="form-control"
          value={donorData.city}
          onChange={(e) => setDonorData({ ...donorData, city: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">State:</label>
        <input
          type="text"
          className="form-control"
          value={donorData.state}
          onChange={(e) => setDonorData({ ...donorData, state: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Country:</label>
        <input
          type="text"
          className="form-control"
          value={donorData.country}
          onChange={(e) => setDonorData({ ...donorData, country: e.target.value })}
          required
        />
      </div>
    </>
  );
};

export default RegisterDonor;
