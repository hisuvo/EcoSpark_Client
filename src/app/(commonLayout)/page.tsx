import SearchBar from "@/components/module/Home/SearchBar";
import HeroBanner from "@/components/module/Home/HeroBanner";
import Testimonials from "@/components/module/Home/Testimonial";
import FeaturedIdeas from "@/components/module/Home/FeaturedIdeas";
import HighImpactIdeas from "@/components/module/Home/HighImpactIdeas";
import NewsletterForm from "@/components/module/Home/NewsletterForm";
import ImpactStatistics from "@/components/module/Home/ImpactStatistics";
import Features from "@/components/module/Home/Features";
import HowItWorks from "@/components/module/Home/HowItWorks";
import Categories from "@/components/module/Home/Categories";
import FAQ from "@/components/module/Home/FAQ";

export default async function Home() {
  return (
    <>
      <HeroBanner />
      <SearchBar />
      <ImpactStatistics />
      <Features />
      <HowItWorks />
      <Categories />
      <HighImpactIdeas />
      <FeaturedIdeas />
      <Testimonials />
      <FAQ />
      <NewsletterForm />
    </>
  );
}
