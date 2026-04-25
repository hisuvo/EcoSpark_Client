import SearchBar from "@/components/module/Home/SearchBar";
import HeroBanner from "../../components/module/Home/HeroBanner";
import Testimonials from "@/components/module/Home/Testimonial";
import FeaturedIdeas from "@/components/module/Home/FeaturedIdeas";
import HighImpactIdeas from "@/components/module/Home/HighImpactIdeas";
import NewsletterForm from "@/components/module/Home/NewsletterForm";

export default async function Home() {
  return (
    <>
      <HeroBanner />
      <SearchBar />
      <HighImpactIdeas />
      <FeaturedIdeas />
      <Testimonials />
      <NewsletterForm />
    </>
  );
}
