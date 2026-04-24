/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCategory, getCategories } from "@/services/categories.service";
import AppPagination from "@/shared/AppPagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import UpdateCategoryDialog from "./UpdateCategoryDialog";
import { toast } from "sonner";

const GetCategories = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: categoryList, isLoading } = useQuery({
    queryKey: ["categories", page],
    queryFn: ({ queryKey }) => {
      const [, page] = queryKey;
      return getCategories({ page, limit: 7 });
    },
    placeholderData: (prev) => prev,
  });

  const categories = categoryList?.data;
  const metaData = categoryList?.meta;



  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      // If this was the last item on the page (and not the first page), move back
      if (categories && categories.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete category");
    },
  });

  return (
    <div className="flex flex-col min-h-[88vh]">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-muted-foreground">
              Manage idea categories for the platform
            </p>
          </div>
          {/* add categories */}
          <CreateCategoryDialog />
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No categories yet. Create one to get started.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>

                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[300px] truncate">
                      {cat.description || "-"}
                    </TableCell>

                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {cat.createdAt &&
                        format(new Date(cat.createdAt), "MMM dd, yyyy")}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Update button */}
                        <UpdateCategoryDialog category={cat} />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Category?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                This will permanently delete the &quot;
                                {cat.name}&quot; category. Related data may be
                                affected.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(cat.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {metaData && metaData.totalPage > 1 && (
        <div className="mt-auto">
          <AppPagination meta={metaData} onPageChange={(p) => setPage(p)} />
        </div>
      )}
    </div>
  );
};

export default GetCategories;
