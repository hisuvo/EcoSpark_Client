"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle } from "lucide-react";
// import { toast } from "sonner";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail("");
    console.log("Subscribed successfully!");
  };

  return (
    <section className="py-16 bg-green-600 dark:bg-green-800">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <Mail className="h-10 w-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-3">Stay Updated</h2>
          <p className="text-green-100 mb-6">
            Subscribe to our newsletter for the latest sustainability ideas, top
            voted projects, and important announcements.
          </p>
          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-100">
              <CheckCircle className="h-5 w-5" />
              <span>Thank you for subscribing!</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-green-200 focus-visible:ring-white"
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={isLoading}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
