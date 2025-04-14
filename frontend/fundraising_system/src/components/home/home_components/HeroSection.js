import React, { useState, useEffect,useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";  // Import axios
import "./HeroSection.css"; 
import { AuthContext } from "../../../context/AuthContext";

const HeroSection = ({causes}) => {
  const {isAuthenticated} = useContext(AuthContext)
  // const [causes, setCauses] = useState([]);

  // // useEffect(() => {
  // //   axios
  // //     .get("http://127.0.0.1:8000/get_causes")
  // //     .then((response) => setCauses(response.data))
  // //     .catch((error) => console.error("Error fetching causes:", error));
  // // }, [])

  // useEffect(() => {
  //   axios
  //     .get("http://127.0.0.1:8000/get_home_details")
  //     .then((response) => console.log(response))
  //     .catch((error) => console.error("Error fetching causes:", error));
  // }, [])

  return (
    <div className="hero-container">
      <h1>Support a Cause That Matters</h1><br /><br />
      <div className="marquee">
        <div className="marquee-content">
          
          {causes.concat(causes).map((cause) => (
            <div key={cause.cause_id} className="cause-card">
              <img src={`http://127.0.0.1:8000/${cause.image}`} alt={cause.title} />
              <h3>{cause.title}</h3>
              <p className="card-text ">{cause.description.substring(0, 25)}...</p>
              <Link to={isAuthenticated? "/donors/cause-list" :"/login"}>
                <button className="gradient-button">Donate Now</button>
              </Link>

          
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
