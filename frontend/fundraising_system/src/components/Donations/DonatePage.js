import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DonatePage.css";
import { AuthContext } from "../../context/AuthContext";

const DonatePage = () => {
  const location = useLocation();
  const { cause_id, cause_name, organization_id, organization_name } = location.state || {};
  const [selectedAmount, setSelectedAmount] = useState("");
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure an amount is selected
    if (!selectedAmount || selectedAmount <= 0) {
      alert("Please enter or select a valid donation amount.");
      return;
    }

    // Navigate to Payment Page with details
    navigate("/donor/payment", {
      state: {
        donor_name: user?.user?.name || "Anonymous",
        donor_email: user?.user?.email || "Not Provided",
        
        donation_amount: selectedAmount,
        cause_id,
        cause_name,
        organization_id,
        organization_name,
      },
    });
  };

  return (
    <div className="donate-container">
      <h2 className="mb-3">
        Donate to <br />
        <span style={{ color: "orange", fontSize: "40px" }}>{cause_name}</span>
      </h2>
      <p>
        <strong>Organization:</strong> {organization_name}
        <br />
        <small style={{ fontSize: "14px" }}>(ID: {organization_id})</small>
      </p>

      <form className="donate-amount" onSubmit={handleSubmit}>
        <label>Choose Donation Amount:</label>
        <div className="donation-options">
          {[10, 20, 30, 1000, 3000, 5000].map((amount) => (
            <button
              type="button"
              key={amount}
              className={`donation-button ${selectedAmount === amount ? "selected" : ""}`}
              onClick={() => handleAmountClick(amount)}
            >
              ${amount}
            </button>
          ))}
        </div>

        <label htmlFor="donationAmount">Or Enter Custom Amount:</label>
        <input
          type="number"
          id="donationAmount"
          name="amount"
          min="1"
          value={selectedAmount}
          onChange={(e) => setSelectedAmount(e.target.value)}
          required
        />

        <button type="submit" className="btn gradient-button">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default DonatePage;
