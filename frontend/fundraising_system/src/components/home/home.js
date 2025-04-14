import React, { useState, useEffect } from "react";
import axios from "axios";
import HeroSection from "./home_components/HeroSection";
import ImpactStats from "./home_components/ImpactStats";
import CTA from "./home_components/cta";
import Welcome from "./home_components/welcome";
import BarChart from "../charts/BarChart";

const Home = () => {
  const [homeData, setHomeData] = useState(null); // State to store API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get_home_details")
      .then((response) => {
        setHomeData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching home details:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>; // Display loading state
  if (error) return <p>Error fetching data!</p>; // Display error message

  return (
    <div className="px-4">
      <br />
      <br />
      <br />
      <Welcome />
      <br />
      <ImpactStats 
        organizations={homeData.organizations} 
        donors={homeData.donors} 
        causeCount={homeData.cause_count} 
        totalRaisedAmount ={homeData.total_raised_amount}
      />
      <br />
      <br />
      <HeroSection causes={homeData.causes} />
      <br />
      <br />
      <BarChart 
               chartData= {{
                labels: homeData.donations_by_location.map(entry => entry.country),
                datasets: [
                  {
                    label: "Total Donations",
                    data: homeData.donations_by_location.map(entry => entry.total_donated),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                  }
                ]
              }}
              title="Donations made accross Nation "
      />
      <br></br>
      <br></br>
      <hr></hr>
     
    
      <CTA />
    </div>
  );
};

export default Home;
