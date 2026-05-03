import React from 'react';
import { Leaf, Lightbulb, Users, BarChart3 } from 'lucide-react';
import SectionHeader from '@/components/shared/SectionHeader';

const features = [
  {
    title: "Innovative Ideas",
    description: "Discover groundbreaking sustainable solutions from creative minds worldwide.",
    icon: Lightbulb,
  },
  {
    title: "Community Driven",
    description: "Collaborate with like-minded individuals to bring eco-friendly projects to life.",
    icon: Users,
  },
  {
    title: "Eco Impact",
    description: "Every idea is measured by its potential to create positive environmental change.",
    icon: Leaf,
  },
  {
    title: "Transparent Growth",
    description: "Track the progress and impact of projects with our detailed statistics.",
    icon: BarChart3,
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Our Values"
          badgeIcon={Leaf}
          title={<>Why Choose <span className="text-primary">EcoSpark?</span></>}
          description="We provide the platform and tools necessary to turn sustainable visions into reality."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
