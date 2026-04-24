"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type Props = {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  onPageChange: (page: number) => void;
};

const AppPagination = ({ meta, onPageChange }: Props) => {
  const { page, totalPage } = meta;

  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center mt-6">
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && onPageChange(page - 1)}
              className={cn(
                "cursor-pointer",
                page === 1 ? "pointer-events-none opacity-50" : "",
              )}
            />
          </PaginationItem>

          {/* Pages */}
          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => onPageChange(p)}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPage && onPageChange(page + 1)}
              className={cn(
                "cursor-pointer",
                page === totalPage ? "pointer-events-none opacity-50" : "",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AppPagination;
