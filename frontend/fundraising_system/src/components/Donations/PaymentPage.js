import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { donation_amount, donor_name, donor_email, cause_id,cause_name, organization_id } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  // Redirect if required details are missing
  useEffect(() => {
    if (!donation_amount || !donor_name || !donor_email || !cause_id || !organization_id) {
      alert("Missing donor details. Redirecting to donation page.");
      navigate("/donate");
    }
  }, [donation_amount, donor_name, donor_email, cause_id, organization_id, navigate]);

  // Function to create an order on the backend
  const createOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("http://localhost:8000/api/paypal/create-order/", {
        amount: donation_amount,
      });

      setLoading(false);
      
      if (response.data.approval_url) {
        // Store donation session details before redirecting
        localStorage.setItem(
          "donation_session",
          JSON.stringify({ donor_name,donor_email, cause_id, organization_id, amount: donation_amount,payment_id:response.data.payment_id })
        );

        window.location.href = response.data.approval_url; // Redirect to PayPal
      } else {
        setError("Error creating PayPal order. Please try again.");
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      setError("Failed to create PayPal order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": "AWMqteFMgnA6z8auxWV-putrqJ1yX-GldxrcRMt7j3ubg6hZS5R9KnAeRD5fWZw6cyRM3vhBhLnne5N0" }}>
      <div className="payment-container">
        <h2>Confirm Your Donation</h2>

        <div className="donation-details">
          <p><strong>Donor Name:</strong> {donor_name}</p>
          <p><strong>Donor Email:</strong> {donor_email}</p>
          <p><strong>Amount:</strong> ${donation_amount}</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p className="loading-message">Processing Payment...</p>
        ) : (
          <PayPalButtons
            createOrder={async () => {
              await createOrder(); // Calls backend and redirects to PayPal
            }}
          />
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default PaymentPage;
