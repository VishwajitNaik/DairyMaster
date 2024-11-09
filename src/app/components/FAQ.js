import React, { useState } from 'react';

// Sample FAQ data
const faqData = [
  { question: 'What is this service?', answer: 'This is a service that helps with...' },
  { question: 'How does it work?', answer: 'It works by...' },
  { question: 'What are the features?', answer: 'The features include...' },
  { question: 'How can I contact support?', answer: 'You can contact support by...' },
  // Add more FAQs as needed
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{width:"1000px"}} className="faq-section p-6 bg-gradient-to-r from-purple-300 via-blue-200 to-green-300 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Frequently Asked Questions</h2>
      <input
        type="text"
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full mb-6 p-3 border text-black border-gray-400 rounded-lg"
      />
      <div className="accordion">
        {filteredFAQs.map((faq, index) => (
          <div key={index} className="faq-item mb-3">
            <button
              className="faq-question text-black w-full text-left p-4 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <div className="faq-answer text-black p-4 bg-white rounded-lg shadow-sm mt-2">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
