import React, { useState  } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RegisterOrgAdmin from "../orgAdmin/RegisterOrgAdmin";
import RegisterDonor from "../donor/RegisterDonor";


const RegisterPage = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState("donor");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(""); // Only for donors
  const [donorData, setDonorData] = useState({ city: "", state: "", country: "" });
  const [selectedOrg, setSelectedOrg] = useState(); // Only for admins
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone_number: phone,
      role,
      ...(role === "donor" ? { dob, ...donorData } : { organization: selectedOrg }),
    };

    try {
      await axios.post("http://127.0.0.1:8000/register_user/", formData);
      if (role =='organization_admin'){
        alert("Your registration is pending..Admin need to Approve.We will let you know the proccess via email")
      }
      else{
        alert("Registration Successful!..You can start impacting the world!");
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mb-5">
      <div className="login-container text-white">
        <h2 className="text-center fw-bold">Register</h2>

        <div className="d-flex justify-content-center gap-3 my-3">
          <button
            className={`btn ${role === "donor" ? "gradient-button w-100" : "text-white border"}`}
            onClick={() => setRole("donor")}
          >
            Donor
          </button>
          <button
            className={`btn  ${role === "organization_admin" ? "gradient-button  w-100" : "text-white border"}`}
            onClick={() => setRole("organization_admin")}
          >
            Organization Admin
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">First Name:</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Last Name:</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number:</label>
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {role === "donor" && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Date of Birth:</label>
              <input
                type="date"
                className="form-control"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          )}

          {role === "donor" ? (
            <RegisterDonor donorData={donorData} setDonorData={setDonorData} />
          ) : (
            <RegisterOrgAdmin selectedOrg={selectedOrg} setSelectedOrg={setSelectedOrg} />
          )}

          <button type="submit" className="btn gradient-button w-100" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="d-flex justify-content-center mt-3">
          <p >
            Already have an account? <Link style={{"color":"darkgrey"}} to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
