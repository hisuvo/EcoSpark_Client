"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state only for the search input to keep typing responsive
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || "",
  );
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Derive other values directly from URL (Source of Truth)
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const approvedOnly = searchParams.get("status") === "APPROVED";
  const limit = 6;

  // Helper to update URL params
  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([name, value]) => {
        if (value === null) {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      });
      return params.toString();
    },
    [searchParams],
  );

  // Track the URL value to detect external changes (like back button)
  const searchInUrl = searchParams.get("searchTerm") || "";
  const [prevSearchInUrl, setPrevSearchInUrl] = useState(searchInUrl);

  // If the URL changed externally, sync the local state during render
  // This pattern is better than useEffect as it avoids cascading renders.
  if (searchInUrl !== prevSearchInUrl) {
    setPrevSearchInUrl(searchInUrl);
    setSearchTerm(searchInUrl);
  }

  // Update URL when search is debounced
  useEffect(() => {
    const searchInUrl = searchParams.get("searchTerm") || "";
    if (debouncedSearch !== searchInUrl) {
      const query = createQueryString({
        searchTerm: debouncedSearch || null,
        page: "1", // Reset to page 1 on new search
      });
      router.replace(`${pathname}?${query}`, { scroll: false });
    }
  }, [debouncedSearch, pathname, router, createQueryString, searchParams]);

  // memo params for the API hook
  const params = useMemo(
    () => ({
      page,
      limit,
      sortBy,
      sortOrder,
      ...(debouncedSearch && { searchTerm: debouncedSearch }),
      ...(approvedOnly && { status: "APPROVED" }),
    }),
    [page, limit, sortBy, sortOrder, debouncedSearch, approvedOnly],
  );

  const { data, isLoading, isError } = useIdeas(params);

  const ideas = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = Math.ceil((meta?.total || 0) / limit);

  // handlers that update the URL
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortBy = (val: string) => {
    const query = createQueryString({ sortBy: val, page: "1" });
    router.push(`${pathname}?${query}`, { scroll: false });
  };

  const handleSortOrder = (val: string) => {
    const query = createQueryString({ sortOrder: val, page: "1" });
    router.push(`${pathname}?${query}`, { scroll: false });
  };

  const toggleApproved = () => {
    const query = createQueryString({
      status: approvedOnly ? null : "APPROVED",
      page: "1",
    });
    router.push(`${pathname}?${query}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const query = createQueryString({ page: String(newPage) });
    router.push(`${pathname}?${query}`, { scroll: false });
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
              <SelectItem value="UPVOTE">Votes</SelectItem>
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
                onClick={() => handlePageChange(page - 1)}
              >
                Prev
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
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
