import React from "react";
import "./feedback.css"; // Import CSS

const steps = [
  { id: 1, title: "Choose a Cause", icon: "🎯", description: "Browse various causes and select the one you want to support." },
  { id: 2, title: "Make a Donation", icon: "💳", description: "Enter your details and contribute securely with just a few clicks." },
  { id: 3, title: "See Your Impact", icon: "📊", description: "Track your donation's impact through updates and reports." },
];

const Feedback = () => {
  return (
    <div className="feedback">
      <h2>How It Works</h2>
      <div className="feedback-steps">
        {steps.map((step) => (
          <div key={step.id} className="feedback-card">
            <span className="icon">{step.icon}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
