import React from 'react';
import SectionHeader from '@/components/shared/SectionHeader';
import { MessageCircleQuestion } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I submit an idea?",
    answer: "You can submit an idea by clicking on the 'Post Idea' button in the dashboard. You'll need to provide a title, description, and the category it falls under."
  },
  {
    question: "Is there a fee for using EcoSpark?",
    answer: "EcoSpark is free to use for community members. We believe in making sustainable action accessible to everyone."
  },
  {
    question: "How are projects funded?",
    answer: "Projects can be funded through community donations, corporate sponsorships, or governmental grants facilitated by our platform."
  },
  {
    question: "Can I collaborate on multiple projects?",
    answer: "Yes! We encourage community members to contribute their skills to as many projects as they feel passionate about."
  },
  {
    question: "How do you verify the impact of ideas?",
    answer: "Our team of experts reviews each project's progress reports and uses standardized metrics to calculate environmental impact."
  }
];

const FAQ = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader
          badge="Support"
          badgeIcon={MessageCircleQuestion}
          title={<>Frequently Asked <span className="text-primary">Questions</span></>}
          description="Everything you need to know about getting started and making an impact with EcoSpark."
        />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold py-6">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
