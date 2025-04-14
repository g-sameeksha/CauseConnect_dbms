import React from "react";
import CountUp from "react-countup";
import "./ImpactStats.css";

const ImpactStats = ({ organizations, donors, causeCount ,totalRaisedAmount}) => {
  return (
    <div className="impact-stats">
      <div className="stat-card">
        <h3>
          <CountUp start={0} end={organizations * 10} duration={2.5} separator="," />+
        </h3>
        <p>Verified Organizations</p>
      </div>
      <div className="stat-card">
        <h3>
          <CountUp start={0} end={donors * 10} duration={2.5} separator="," />+
        </h3>
        <p>Donors</p>
      </div>
      <div className="stat-card">
        <h3>
          <CountUp start={0} end={causeCount * 10} duration={2.5} separator="," />+
        </h3>
        <p>Causes Supported</p>
      </div>
      <div className="stat-card">
        <h3>
          <CountUp start={0} end={totalRaisedAmount* 10} duration={2.5} separator="," />+
        </h3>
        <p>Total Amount Raised</p>
      </div>
    </div>
  );
};

export default ImpactStats;
