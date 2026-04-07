import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Target, Users, Globe } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: "Sustainability First",
      description:
        "Every idea on our platform is evaluated for its environmental impact and potential to create lasting positive change.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Our strength lies in our diverse community of innovators, activists, scientists, and everyday people passionate about the environment.",
    },
    {
      icon: Target,
      title: "Action Oriented",
      description:
        "We believe in turning ideas into action. Our platform helps connect great ideas with the resources needed to implement them.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "Environmental challenges know no borders. We bring together perspectives from around the world to find solutions that work everywhere.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">About EcoSpark Hub</h1>
        <p className="text-lg text-muted-foreground">
          EcoSpark Hub is a community-driven platform dedicated to collecting,
          sharing, and promoting sustainability-oriented ideas. We believe that
          collective intelligence is the key to solving our planet&apos;s most
          pressing environmental challenges.
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-3xl mx-auto mb-16">
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700 dark:text-green-400">
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              To empower communities worldwide by providing a platform where
              anyone can share their sustainability ideas, receive constructive
              feedback, and see their proposals gain the visibility and support
              they deserve. We aim to bridge the gap between innovative thinking
              and real-world environmental action.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.title}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Icon className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="space-y-8">
          {[
            {
              step: "1",
              title: "Share Your Idea",
              description:
                "Register on the platform and submit your sustainability idea with a clear problem statement and proposed solution.",
            },
            {
              step: "2",
              title: "Community Review",
              description:
                "Our admin team reviews your submission for quality and feasibility. Approved ideas become visible to the entire community.",
            },
            {
              step: "3",
              title: "Vote & Discuss",
              description:
                "Community members can upvote or downvote ideas and engage in discussions through our nested comment system.",
            },
            {
              step: "4",
              title: "Make an Impact",
              description:
                "Top-voted ideas gain visibility and can inspire real-world environmental projects and initiatives.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
