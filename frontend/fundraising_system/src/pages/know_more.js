import React from "react";
import FAQs from "../components/ui/more/faqs";
import Feedback from "../components/ui/more/feedback";


const KnowMore = () => {
  return (
    <div className="know-more-page p-5">
      
      <h1 style={{ color: "white", textAlign: "center" }}>Know More About CauseConnect</h1>

<p style={{ color: "white", textAlign: "center" }}>
Learn how our platform works and find answers to frequently asked questions.</p>
      {/* Feedback (How It Works) Section */}
      <Feedback />

      {/* FAQs Section */}
      <FAQs />
    </div>
  );
};

export default KnowMore;
