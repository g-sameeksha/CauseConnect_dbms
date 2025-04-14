import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const PaymentApprove = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentID = searchParams.get("paymentId");
  const payerID = searchParams.get("PayerID");
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  useEffect(() => {
    if (!paymentID || !payerID) return; // ✅ Ensure parameters exist

    // ✅ Check if already processed using localStorage
    if (localStorage.getItem("payment_processing") === "true") {
      console.log("Payment is already being processed. Skipping duplicate request.");
      return;
    }

    localStorage.setItem("payment_processing", "true"); // ✅ Lock payment processing

    const donationSession = JSON.parse(localStorage.getItem("donation_session"));

    if (!donationSession) {
      alert("Session expired! Please try again.");
      localStorage.removeItem("payment_processing"); // ❌ Unlock on failure
      navigate("/donate");
      return;
    }

    const { donor_email, cause_id, organization_id, amount } = donationSession;

    axios
      .post("http://localhost:8000/api/paypal/capture-payment/", {
        paymentID,
        payerID,
        donor_email,
        cause_id,
        organization_id,
        amount,
      })
      .then((response) => {
        alert("Payment Successful!");

        // ✅ Clear session and lock after successful request
        localStorage.removeItem("donation_session");
        localStorage.removeItem("payment_processing");

        const donationData = {
          donation_id: response.data.donation_id,
          donor_name: donationSession.donor_name,
          donor_email,
          amount,
          payment_id: paymentID,
        };

        navigate("/payment-success", { state: donationData });
      })
      .catch(() => {
        alert("Payment verification failed! Or it has already been verified.");
        localStorage.removeItem("payment_processing"); // ❌ Unlock on failure
        navigate("/donate");
      });
  }, []); // ✅ Empty dependency array ensures it runs only once

  return <h2>Processing Payment...</h2>;
};

export default PaymentApprove;
