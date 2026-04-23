import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const blogPosts = [
  {
    id: 1,
    title: "10 Simple Ways to Reduce Your Carbon Footprint",
    excerpt:
      "Small changes in daily habits can make a significant impact on your carbon footprint. From adjusting your thermostat to choosing local produce, discover practical steps you can take today.",
    category: "Lifestyle",
    author: "Sarah Green",
    date: "2024-06-15",
    imageUrl: "https://i.ibb.co.com/7xz7CJQS/blog-img-1.webp",
  },

  {
    id: 2,
    title: "The Rise of Community Solar Projects",
    excerpt:
      "Community solar is transforming how neighborhoods access renewable energy. Learn how shared solar installations are making clean energy accessible to everyone, regardless of homeownership status.",
    category: "Energy",
    author: "John Eco",
    date: "2024-06-10",
    imageUrl: "https://i.ibb.co.com/DDvxw82q/blog-img-2.webp",
  },
  {
    id: 3,
    title: "Zero Waste Living: A Beginner's Guide",
    excerpt:
      "Transitioning to a zero-waste lifestyle doesn't have to be overwhelming. This guide breaks down the journey into manageable steps, starting with the easiest swaps you can make today.",
    category: "Waste",
    author: "Maria Sustainability",
    date: "2024-06-05",
    imageUrl: "https://i.ibb.co.com/8DFZcpXM/blog-img-3.webp",
  },
  {
    id: 4,
    title: "Urban Farming: Growing Food in Small Spaces",
    excerpt:
      "You don't need a large backyard to grow your own food. Discover innovative urban farming techniques including vertical gardens, container gardening, and rooftop agriculture.",
    category: "Food",
    author: "Emma Earth",
    date: "2024-05-28",
    imageUrl: "https://i.ibb.co.com/sJJkPMHy/blog-img-4.webp",
  },
  {
    id: 5,
    title: "The Future of Electric Transportation",
    excerpt:
      "From e-bikes to electric buses, the transportation sector is undergoing a green revolution. Explore the latest innovations and what they mean for sustainable urban mobility.",
    category: "Transportation",
    author: "David Nature",
    date: "2024-05-20",
    imageUrl:
      "https://i.ibb.co.com/svFBPMKG/the-future-of-electric-vehicles-in-staff-transportation.jpg",
  },
  {
    id: 6,
    title: "Water Conservation Techniques for Every Home",
    excerpt:
      "Water scarcity affects communities worldwide. Learn practical water conservation methods that can reduce your household water usage by up to 40% without sacrificing comfort.",
    category: "Water",
    author: "Sarah Green",
    date: "2024-05-15",
    imageUrl: "https://i.ibb.co.com/Z6ZpKG5Q/home-water-conservation.jpg",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay informed with the latest sustainability insights, tips, and
          stories from our community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {blogPosts.map((post) => (
          <Card
            key={post.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <div className="relative w-full h-64">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <CardHeader className="pb-2">
              <Badge
                variant="secondary"
                className="w-fit bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              >
                {post.category}
              </Badge>
              <h2 className="font-semibold text-lg line-clamp-2 group-hover:text-green-600 transition-colors mt-2">
                {post.title}
              </h2>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Button
                variant="ghost"
                size={"sm"}
                className="text-green-600 hover:text-green-700 p-0"
              >
                <Link href={"/"} className="flex justify-center items-center">
                  Read
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
