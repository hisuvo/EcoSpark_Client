"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/ideas?searchTerm=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search ideas by name or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Search
            </Button>
          </form>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="text-xs text-muted-foreground">Popular:</span>
            {["Energy", "Waste", "Transportation", "Water"].map((tag) => (
              <Link
                key={tag}
                href={`/ideas?searchTerm=${tag}`}
                className="text-xs text-green-600 hover:underline"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
