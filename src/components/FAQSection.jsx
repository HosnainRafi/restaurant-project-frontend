import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
  {
    question: 'How can I place an order?',
    answer:
      'You can place an order by browsing our menu, selecting the items you want, and proceeding to checkout. You can choose pickup or delivery if available.',
  },
  {
    question: 'Can I pay online?',
    answer:
      'Yes! Our platform supports secure online payments via credit card, debit card, or mobile payment options.',
  },
  {
    question: 'How do I pick up my order?',
    answer:
      'After placing an order, you will receive an estimated pickup time. Arrive at the restaurant and provide your order ID to collect your order.',
  },
  {
    question: 'Can I view my past orders?',
    answer:
      "Yes, you can view your past orders in the 'My Orders' section of your account.",
  },
  {
    question: 'How does the admin manage orders?',
    answer:
      'Admins can view all incoming orders, update order statuses, manage inventory, and track customer activity from the admin dashboard.',
  },
  {
    question: 'What if I need to cancel or modify my order?',
    answer:
      'Orders can only be modified or canceled before they are prepared. Contact the restaurant directly or use the platform if the option is available.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto my-12 p-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#8B1E3F]">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full flex justify-between items-center p-4 text-left transition-colors ${
                openIndex === index
                  ? 'bg-[#fffaf5] text-gray-800' // open FAQ background
                  : 'bg-[#fdfdfd] text-gray-800 hover:bg-[#fff5f0]' // collapsed light color
              }`}
            >
              <span>{faq.question}</span>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openIndex === index && (
              <div className="p-4 bg-[#fffaf5] text-gray-700">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
