import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAVBAR_LINKS } from "./NavBarLink";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { role, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate(); // Get navigate function

  // Function to handle logout and navigate
  const handleLogoutClick = () => {
    handleLogout();  // Call logout from AuthContext
    navigate("/");   // Navigate to home page after logout
  };

  const roleLinks = role
  ? role === "Admin"
    ? NAVBAR_LINKS.admin
    : role === "Organization_admin"
    ? NAVBAR_LINKS.orgAdmin
    : role === "Donor"
    ? NAVBAR_LINKS.donor
    : NAVBAR_LINKS.general
  : NAVBAR_LINKS.general;



  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">

        <Link className="navbar-brand" to="/">
        <img 
            src="/logo.png"  
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-text-top me-2"
          />
          CauseConnect</Link>


        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Role-Based Links */}
            {roleLinks.map((link) => (
              <li key={link.path} className="nav-item">
                <Link className="nav-link" to={link.path}>{link.name}</Link>
              </li>
            ))}
            {/* Constant Links */}
            {NAVBAR_LINKS.common.map((link) => (
              <li key={link.path} className="nav-item">
                <Link className="nav-link" to={link.path}>{link.name}</Link>
              </li>
            ))}
            {/* Logout Button */}
            {role && (
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogoutClick}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
