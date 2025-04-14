import React from "react";
import BarChart from "../components/charts/BarChart";
import OrgBarChart from "../components/charts/OrgBarChart";
import LineChart from "../components/charts/LineChart";

import "../utils/Stats.css"

const Stats = () => {
  return (
    <div className="chart-container">
        <BarChart />
      </div>
    // <div className="stats-container">
    //   <br/>

    //   <h1 style={{ textAlign: "center", color: "white", fontSize: "28px", fontWeight: "bold" }}>
    //     Donation Insights Dashboard
    //   </h1>    

    //   <h4 style={{ textAlign: "center", color: "white", fontSize: "16px", marginBottom: "20px" }}>
    //     Track the impact of donations across different causes in real time.
    //   </h4>

    //   <br/>

    //   {/* Cause-wise Donations */}
    //   <p>
    //     <strong>"Understanding Where Donations Go"</strong><br />
    //     Each cause receives a different level of financial support based on donor interest and urgency. 
    //     Education, healthcare, and disaster relief often attract the highest donations, reflecting their 
    //     critical impact on society. However, causes like wildlife conservation and women empowerment also 
    //     play vital roles and need sustained contributions. By analyzing donation distribution, we can 
    //     identify which causes require more awareness and funding.
    //   </p>
      

    //   <br/>

    //   {/* Organizations per Cause */}
    //   <p>
    //     <strong>"Who is Making a Difference?"</strong><br />
    //     Multiple organizations are dedicated to addressing different social issues. Some causes, like 
    //     healthcare and hunger relief, have a higher number of organizations due to the widespread need. 
    //     However, smaller causes like wildlife conservation might have fewer organizations working towards 
    //     their mission. This data helps us see where more initiatives and support groups are required to 
    //     make an impact.
    //   </p>
    //   <div className="chart-container">
    //     <OrgBarChart />
    //   </div>

    //   <br/>
      
    //   {/* Yearly Donations Trend */}
    //   <p>
    //     <strong>"Tracking the Growth of Giving"</strong><br />
    //     Over the years, donations have fluctuated due to economic conditions, global crises, and social 
    //     awareness. Increases in donations often correlate with major disasters, pandemic relief efforts, 
    //     and economic growth. A steady rise in contributions signifies greater public engagement and trust 
    //     in donation platforms. Identifying trends in giving can help us forecast future needs and optimize 
    //     fundraising efforts.
    //   </p>
    //   <div className="chart-container">
    //     <LineChart />
    //     <br />
    //   </div>
    // </div>
  );
};

export default Stats;
