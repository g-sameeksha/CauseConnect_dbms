import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const RegisterOrganization = () => {
  const navigate = useNavigate(); // Use navigate instead of onBack

  const [newOrg, setNewOrg] = useState({
    name: "",
    registration_number  : "",
    about: "",
    email: "",
    phone_number: "",
    address: "",
    image: null, 
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(null); // For image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewOrg({ ...newOrg, image: file }); // Change logo to image (fix)
      setPreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    Object.keys(newOrg).forEach((key) => {
      formData.append(key, newOrg[key]);
    });

    try {
      await axios.post("http://127.0.0.1:8000/register_organization/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("organization registration application submitted.Approve of your form will be let you know on ");
      setNewOrg({ name: ""  ,registration_number :"", about: "", email: "", phone_number: "", address: "", image: null });
      setPreview(null);

      // Navigate back to the admin home after a short delay
      setTimeout(() => navigate("/register"), 5000);
    } catch {
      setError(" Error creating organization. Try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "600px" }}>
        <h4 className="text-center mb-3">🏢 Register Organization</h4>

        {error && <div className="alert alert-danger p-2">{error}</div>}
        {success && <div className="alert alert-success p-2">{success}</div>}

        <form onSubmit={handleCreateOrganization} encType="multipart/form-data">
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Organization Name"
              value={newOrg.name}
              onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Govt. Registration number"
              value={newOrg.registration_number }
              onChange={(e) => setNewOrg({ ...newOrg,  registration_number : e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <textarea
              className="form-control"
              style={{ height: "150px" }}
              placeholder="About"
              value={newOrg.about}
              onChange={(e) => setNewOrg({ ...newOrg, about: e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={newOrg.email}
              onChange={(e) => setNewOrg({ ...newOrg, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Phone Number"
              value={newOrg.phone_number}
              onChange={(e) => setNewOrg({ ...newOrg, phone_number: e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <textarea              
              type="text"
              className="form-control"
              style={{ height: "90px" }}
              placeholder="Address"
              value={newOrg.address}
              onChange={(e) => setNewOrg({ ...newOrg, address: e.target.value })}
              required
            />
          </div>

          {/* Image Upload Field */}
          <div className="mb-3">
            <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="Preview" className="img-fluid rounded mt-2" style={{ maxWidth: "200px" }} />}
          </div>

          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>

        <button className="btn btn-light w-100 mt-2" onClick={() => navigate(-1)}>⬅ Back</button> 
      </div>
    </div>
  );
};

export default RegisterOrganization;
