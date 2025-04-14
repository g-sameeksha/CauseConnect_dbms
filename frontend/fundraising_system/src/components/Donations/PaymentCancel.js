import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentCancel.css";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Clear donation session on cancel
    localStorage.removeItem("donation_session");

    // ✅ Redirect to donation page after a short delay
    setTimeout(() => {
      navigate("/donate");
    }, 5000);
  }, [navigate]);

  return (
    <div className="payment-cancel-container">
      <h1>❌ Payment Canceled</h1>
      <p>It looks like you canceled the payment process.</p>
      <p>If this was a mistake, you can try again.</p>

      <a href="/donate" className="btn">Try Again</a>
    </div>
  );
};

export default PaymentCancel;
