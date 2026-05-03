import React from 'react';
import SectionHeader from '@/components/shared/SectionHeader';
import { HelpCircle } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Share Your Vision",
    description: "Submit your sustainable idea and describe its potential environmental impact."
  },
  {
    number: "02",
    title: "Gather Support",
    description: "Connect with experts and community members who share your passion."
  },
  {
    number: "03",
    title: "Develop & Refine",
    description: "Collaboratively improve the project details and implementation plan."
  },
  {
    number: "04",
    title: "Make an Impact",
    description: "Launch your project and track its positive contribution to the planet."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Our Process"
          badgeIcon={HelpCircle}
          title={<>How It <span className="text-primary">Works</span></>}
          description="A simple four-step process to get your eco-friendly ideas off the ground."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-1/2 -z-10" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6 ring-8 ring-primary/10">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
