import React from "react";
import DonationForm from "../components/donation/Donation_Form";

const Donate = () => {
  return (
    <div className="donate-page">
      <br /> 
      <br />
      <h1 style={{ color: "white", textAlign: "center" }}>Make a Donation</h1>

      <p style={{ color: "white", textAlign: "center" }}>
        Your support can change lives. Choose an amount and contribute today.
      </p>

      <DonationForm /> 
    </div>
  );
};

export default Donate;
