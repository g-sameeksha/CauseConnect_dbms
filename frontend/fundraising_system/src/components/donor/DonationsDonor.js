import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./DonationsDonor.css"; // Import CSS file for styling

const DonationsDonor = () => {
  const [donationList, setDonationList] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/donor_get_donations", {
          params: { email: user.email },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        });

        setDonationList(response.data.donations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [user.email]);

  return (
    <div className="donations-container">
      <h2 className="title">My Donations</h2>

      <div className="table-container">
        <table className="donation-table">
          <thead>
            <tr>
              <th>Donation ID</th>
              <th>Cause</th>
              <th>Organization</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {donationList.length > 0 ? (
              donationList.map((donation) => (
                <tr  key={donation.donation_id}>
                  <td className="wrap-text">{donation.donation_id}</td>
                  <td className="wrap-text">{donation.cause__title}</td>
                  <td className="wrap-text">{donation.organization__name}</td>
                  <td>${donation.amount}</td>
                  <td>{new Date(donation.date).toLocaleDateString()}</td>
                  <td>{donation.payment_method}</td>
                  <td className="wrap-text">{donation.payment_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No donations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsDonor;
