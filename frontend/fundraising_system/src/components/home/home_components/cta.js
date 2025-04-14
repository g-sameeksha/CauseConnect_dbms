import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import "./cta.css";
import { AuthContext } from "../../../context/AuthContext";

const CTA = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="cta-section">
      <h2>Ready to Make an Impact?</h2>
      <p>Join thousands of donors making a difference.</p>
      <div className="cta-buttons">
        {!isAuthenticated  && <Link to="/register">
          <button className="gradient-button">Get Started</button>
        </Link>}
        <Link to={isAuthenticated? "/donors/cause-list" :"/login"}>
          <button className="gradient-button">Donate Now</button>
        </Link>
      </div>
    </div>
  );
};

export default CTA;
