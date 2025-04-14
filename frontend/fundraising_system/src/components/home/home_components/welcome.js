import React, { useContext } from "react";
import "./welcome.css"; 
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

const Welcome = () => {
  const {isAuthenticated,user} = useContext(AuthContext)
  return (
    <div className="welcome-section">
      <h1 className="my-3 mb-5 ">Welcome to CauseConnect<span > {isAuthenticated && ", "+user.name}</span></h1>
      <h3>Your support makes a difference. Discover causes, donate, and change lives.</h3>
      <br />
      <h6 >"No one has ever become poor by giving." – Anne Frank </h6>
      <p className="welcome-text">
        <br />
        Join hands with us to create a world where every contribution brings hope and change.  
        Support a cause that truly matters and make a lasting impact.  
        Whether it’s education, healthcare, disaster relief, or helping the underprivileged,  
        your generosity can change lives for the better.  
      </p>


      <Link to={isAuthenticated ? "/donors/cause-list" : "/login"}>
      <button 
        className="gradient-button" 
        style={{ borderRadius: "12px", height: "4rem", width:"50%", fontSize: "1.5rem" }}
      >
        Donate Now <i className="bi bi-arrow-right"></i>  
      </button>
    </Link>

      
    </div>
  );
};

export default Welcome;
