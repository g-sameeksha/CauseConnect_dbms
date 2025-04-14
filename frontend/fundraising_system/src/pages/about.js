import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./about.css"; // Optional: Add custom styles

const About = () => {
  return (
    <div className="about-page p-5">
      
      {/* ✅ Hero Section */}
      <div className="about-hero mx-5">
        <h1>About CauseConnect</h1>
        <p>Connecting people with causes that matter. Together, we make a difference.</p>
      </div>

      {/* ✅ Mission Section */}
      <section className="mission-section mx-5 mb-5">
        <h2>Our Mission</h2>
        <p>
          CauseConnect is dedicated to bridging the gap between donors and meaningful causes. 
          We provide a secure and transparent platform where donations directly impact lives.
        </p>
      </section>

      {/* ✅ Accordion (FAQs) */}
      <div className="accordion accordion-flush mx-5" id="accordionFlushExample">
        {/* First Accordion Item */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#flush-collapseOne" 
              aria-expanded="false" 
              aria-controls="flush-collapseOne"
            >
              How does CauseConnect work?
            </button>
          </h2>
          <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
            <div className="accordion-body">
              CauseConnect allows users to explore various causes, make donations, and track their impact. 
              Simply choose a cause, enter your details, and donate securely!
            </div>
          </div>
        </div>

        {/* Second Accordion Item */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#flush-collapseTwo" 
              aria-expanded="false" 
              aria-controls="flush-collapseTwo"
            >
              Is my donation secure?
            </button>
          </h2>
          <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
            <div className="accordion-body">
              Yes! We use secure payment gateways to process transactions. 
              Your personal information is encrypted and protected.
            </div>
          </div>
        </div>

        {/* Third Accordion Item */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#flush-collapseThree" 
              aria-expanded="false" 
              aria-controls="flush-collapseThree"
            >
              Can I track my donations?
            </button>
          </h2>
          <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
            <div className="accordion-body">
              Yes! Once you've donated, you will receive a confirmation email with details. 
              You can also check your donation history in your user dashboard.
            </div>
          </div>
        </div>

        {/* Fourth Accordion Item */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#flush-collapseFour" 
              aria-expanded="false" 
              aria-controls="flush-collapseFour"
            >
              Are donations tax-deductible?
            </button>
          </h2>
          <div id="flush-collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
            <div className="accordion-body">
              It depends on the organization you donate to. Some organizations provide tax-deductible receipts. 
              Please check with the respective cause for details.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
