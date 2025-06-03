
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What are AICTE points and why do I need 100 of them?",
      answer: "AICTE points are credits awarded for participating in various extracurricular and professional development activities. VTU requires students to earn at least 100 points before graduation to ensure holistic development beyond academic coursework."
    },
    {
      question: "How does the app notify me about nearby events?",
      answer: "The app uses your location (with permission) to identify AICTE-approved events happening in your vicinity. You'll receive notifications based on your preferences and proximity to these events."
    },
    {
      question: "Can I track points for activities I've already completed?",
      answer: "Yes! You can add past activities and upload the corresponding certificates to track points you've already earned."
    },
    {
      question: "How secure is the certificate storage feature?",
      answer: "All certificates are stored securely with encryption. Only you can access your certificates unless you choose to share them with university administrators."
    },
    {
      question: "Is the app officially recognized by VTU?",
      answer: "While we're not officially affiliated with VTU, our app is designed to help VTU students track their progress toward meeting official AICTE requirements."
    },
    {
      question: "How do I verify that an event qualifies for AICTE points?",
      answer: "All events listed in the app are pre-verified to qualify for AICTE points. For events you discover elsewhere, you can use our verification tool to check if they qualify before attending."
    }
  ];

  return (
    <div className="py-16 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-vtu-blue mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about our app and AICTE points
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left font-medium text-vtu-blue hover:text-vtu-lightBlue">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
