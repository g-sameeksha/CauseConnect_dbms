import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./faqs.css"; 

const faqs = [
  {
    id: 1,
    question: "How does CauseConnect work?",
    answer: "CauseConnect allows users to explore various causes, make donations, and track their impact."
  },
  {
    id: 2,
    question: "Is my donation secure?",
    answer: "Yes! We use secure payment gateways to process transactions. Your personal information is encrypted and protected."
  },
  {
    id: 3,
    question: "Can I track my donations?",
    answer: "Yes! Once you've donated, you will receive a confirmation email with details. You can also check your donation history in your user dashboard."
  },
  {
    id: 4,
    question: "Are donations tax-deductible?",
    answer: "It depends on the organization you donate to. Some organizations provide tax-deductible receipts."
  }
];

const FAQs = () => {
  return (
    <div className="faqs-container">
      <h2>Frequently Asked Questions</h2>
      <div className="accordion accordion-flush" id="faqsAccordion">
        {faqs.map((faq) => (
          <div key={faq.id} className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button collapsed" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target={`#faq-${faq.id}`}
                aria-expanded="false" 
                aria-controls={`faq-${faq.id}`}
              >
                {faq.question}
              </button>
            </h2>
            <div id={`faq-${faq.id}`} className="accordion-collapse collapse" data-bs-parent="#faqsAccordion">
              <div className="accordion-body">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
