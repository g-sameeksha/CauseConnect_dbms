import React, { useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentDone = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const donationData = location.state;

  useEffect(() => {
    if (!donationData) {
      alert("No payment details found. Redirecting...");
      navigate("/donate");
      return;
    }
    
    // ✅ Clear donation session after successful payment
    localStorage.removeItem("donation_session");

  }, [donationData, navigate]);

  return (
    <div className="payment-container">
      <h1>🎉 Payment Successful!</h1>
      <p>Thank you for your donation! Your support means a lot.</p>

      <div className="payment-details">
        <h3><strong>Donation ID:</strong> {donationData.donation_id}</h3>
        <p><strong>Donor:</strong> {donationData.donor_name}</p>
        <p><strong>Email:</strong> {donationData.donor_email}</p>
        <p><strong>Payment ID:</strong> {donationData.payment_id}</p>
        <p><strong>Amount Donated : {donationData.amount}</strong></p>
        
        <p>Your generosity is greatly appreciated!</p>
      </div>

      <a href="/" className="btn">Back to Home</a>
    </div>
  );
};

export default PaymentDone;
