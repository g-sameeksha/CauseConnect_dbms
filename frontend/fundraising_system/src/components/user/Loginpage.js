import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link,  useNavigate } from "react-router-dom";

const Loginpage = () => {
  const { login } = useContext(AuthContext);  // Ensure AuthContext is correctly used
  const navigate = useNavigate(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Donor");
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (role === "Organization_admin") {
      axios
        .get("http://127.0.0.1:8000/get_organizations")
        .then((response) => setOrganizations(response.data.organizations))
        .catch((err) => console.error("Error fetching organizations:", err));
    }
  }, [role]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(email, password, role, selectedOrg || null); 

  
      // if (user === 'Admin') {
      //   navigate('/admin-home');  
      // } else if (user === 'Donor') {
      //   navigate('/donor-home');
      // } else if (user=== 'Organization_admin'){
      //   navigate('/orgadmin-home');
      // }
      if(user){
        navigate("/")
      }
      else{
        setError("Something went wrong")
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-white container d-flex justify-content-center align-items-center vh-100 ">
      <div className="login-container" >   
        <h2 className="text-center fw-bold" style={{color: "white"}}>Welcome Back</h2>
        <p className="text-center text-muted">Login to continue</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label fw-semibold">Role:</label>
            <select
              className="form-control"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Donor">Donor</option>
              <option value="Organization_admin">Organization Admin</option>
              <option value="Admin">Admin</option>

            </select>
          </div>

          {role === "Organization_admin" && (
            <div className="mb-3">
              <label htmlFor="organization" className="form-label fw-semibold">Select Organization:</label>
              <select
                className="form-control"
                id="organization"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                required
              >
                <option value="">Select an organization</option>
                {organizations.map((org) => (
                  <option key={org.registration_number} value={org.registration_number}>{org.name}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className="btn gradient-button w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          
          {/* <div className="d-flex mt-2 justify-content-end align-items-center">
          <p><Link to="/" className="text-decoration-none text-white">Forgot password? </Link></p>
          </div>
          <hr /> */}
          <br></br>
          <hr></hr>

        </form>
        <div className="d-flex justify-content-center align-items-center">
        <p>Don't have an account? <Link to="/register" className="text-decoration-none text-white">Sign up</Link></p>
        </div>
      

      </div>
    </div>
  );
};

export default Loginpage;
