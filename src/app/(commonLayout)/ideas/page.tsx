"use client";

import { useMemo, useState } from "react";
import IdeaCard from "@/components/module/idea/IdeaCard";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useIdeas } from "@/hooks/useIdeas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GetAllIdeasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [page, setPage] = useState(1);
  const limit = 6;

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [approvedOnly, setApprovedOnly] = useState(false);

  // memo params
  const params = useMemo(
    () => ({
      page,
      limit,
      sortBy,
      sortOrder,
      ...(debouncedSearch && { searchTerm: debouncedSearch }),
      ...(approvedOnly && { status: "APPROVED" }), // backend filter
    }),
    [page, limit, sortBy, sortOrder, debouncedSearch, approvedOnly],
  );

  console.log("user memo inside params ->", params);

  const { data, isLoading, isError } = useIdeas(params);

  const ideas = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = Math.ceil((meta?.total || 0) / limit);

  // handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSortBy = (val: string) => {
    setSortBy(val);
    setPage(1);
  };

  const handleSortOrder = (val: string) => {
    setSortOrder(val);
    setPage(1);
  };

  const toggleApproved = () => {
    setApprovedOnly((prev) => !prev);
    setPage(1);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold text-green-700">Explore Ideas</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <Input
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={handleSearch}
            className="sm:w-[250px]"
          />

          {/* Sort By */}
          <Select value={sortBy} onValueChange={handleSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="_count.votes">Votes</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select value={sortOrder} onValueChange={handleSortOrder}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>

          {/* Approved Filter */}
          <Button
            variant={approvedOnly ? "default" : "outline"}
            onClick={toggleApproved}
          >
            {approvedOnly ? "Approved Only" : "All Ideas"}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex gap-2 flex-wrap">
        {approvedOnly && <Badge variant="secondary">Approved</Badge>}
        {debouncedSearch && (
          <Badge variant="secondary">Search: {debouncedSearch}</Badge>
        )}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="size-8" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-destructive">
          Failed to load ideas
        </div>
      ) : ideas.length > 0 ? (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          No ideas found
        </div>
      )}
    </div>
  );
}
