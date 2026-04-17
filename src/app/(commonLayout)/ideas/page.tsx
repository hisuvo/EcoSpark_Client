/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import IdeaCard from "@/components/module/idea/IdeaCard";
import { Spinner } from "@/components/ui/spinner";
import { getIdeas } from "@/services/idea.service";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function GetAllIdeasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Reset to page 1 when search or sorting changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  const handleSortByChange = (val: string) => {
    setSortBy(val);
    setPage(1);
  };
  const handleSortOrderChange = (val: string) => {
    setSortOrder(val);
    setPage(1);
  };

  const params: Record<string, unknown> = {
    page,
    limit,
    sortBy,
    sortOrder,
  };

  if (debouncedSearchTerm) {
    params.searchTerm = debouncedSearchTerm;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ideas", params],
    queryFn: () => getIdeas(params),
  });

  const ideasList = data?.data?.data || [];
  const meta = data?.data?.meta;
  const totalPages =
    meta?.totalPage || Math.ceil((meta?.total || 0) / limit) || 1;

  console.log("this is ideaList", ideasList);

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-green-700">Explore Ideas</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="sm:w-[300px]"
          />

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={handleSortOrderChange}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner data-icon="inline-start" className="size-8" />
          <p className="mt-4 text-muted-foreground">Loading ideas...</p>
        </div>
      ) : isError ? (
        <div className="flex justify-center py-20 text-destructive text-lg">
          Error loading ideas. Please try again later.
        </div>
      ) : ideasList.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideasList.map((idea: any) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pt-8 w-full max-w-lg mx-auto">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage((p) => p - 1);
                      }}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= page - 1 && pageNumber <= page + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            isActive={page === pageNumber}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    if (
                      (pageNumber === 2 && page > 3) ||
                      (pageNumber === totalPages - 1 && page < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={`ellipsis-${pageNumber}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) setPage((p) => p + 1);
                      }}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground text-lg">
            No ideas found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
