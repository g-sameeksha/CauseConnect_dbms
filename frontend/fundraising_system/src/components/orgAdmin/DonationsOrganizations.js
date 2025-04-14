import React, { useEffect, useState } from "react";
import axios from "axios";

const DonationsOrganizations = () => {
  const [donations, setDonations] = useState([]);
  const [causes, setCauses] = useState([]);
  const [selectedCause, setSelectedCause] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    fetchCauses();
    fetchDonations();
  }, [currentPage, selectedCause]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      let url = `http://127.0.0.1:8000/organization_get_donations?page=${currentPage}`;
      if (selectedCause) url += `&cause=${selectedCause}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonations(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (err) {
      setError("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  const fetchCauses = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("http://127.0.0.1:8000/organization_get_causes/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCauses(response.data);
    } catch (err) {
      console.error("Failed to fetch causes");
    }
  };

  return (
    <div className="donations-container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Organization Donations</h2>

      {/* Cause Filter */}
      <div className="mb-4">
        <label htmlFor="causeFilter" className="font-semibold">Filter by Cause:</label>
        <select
          id="causeFilter"
          value={selectedCause}
          onChange={(e) => setSelectedCause(e.target.value)}
          className="border p-2 ml-2"
        >
          <option value="">All Causes</option>
          {causes.map((cause) => (
            <option key={cause.cause_id} value={cause.cause_id}>
              {cause.title} {cause.cause_id}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="no-data">{error}</p>
      ) : donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <>
          <hr />
          <table className="donation-table">
            <thead>
              <tr >
                <th >Donor</th>
                <th >Contact</th>
                <th >Amount</th>
                <th >Date</th>
                <th >Cause</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} className="text-center">
                  <td className="border">
                    {donation.donor.user.first_name} {donation.donor.user.last_name}
                  </td>
                  <td className="border">
                    {donation.donor.user.email} <br />
                    {donation.donor.city}, {donation.donor.state}, {donation.donor.country}
                  </td>
                  <td  className="border">${donation.amount}</td>
                  <td className="border">
                    {new Date(donation.date).toLocaleDateString()}
                  </td>
                  <td className="border">{donation.cause.title}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Buttons */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={!prevPage}
              className={`px-4 py-2 mx-2 rounded ${
                prevPage ? "bg-blue-500 text-black" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-lg font-semibold">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!nextPage}
              className={`px-4 py-2 mx-2 rounded ${
                nextPage ? "bg-blue-500 text-black" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DonationsOrganizations;
