/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Loader2, Edit } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { updateCategory } from "@/services/categories.service";
import AppField from "@/shared/form/AppField";
import { ICategory } from "@/type/category.type";
import { categorySchema } from "./CreateCategoryDialog";
import { toast } from "sonner";

interface Props {
  category: ICategory;
}

const UpdateCategoryDialog = ({ category }: Props) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const categoryUpdateMutation = useMutation({
    mutationFn: (data: any) => updateCategory(category.id, data),
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
    },
    onError: (error: any) => {
      console.error(error?.message);
      toast.error("Failed to update category");
    },
  });

  const form = useForm({
    defaultValues: {
      name: category.name,
      description: category.description || "",
    },

    onSubmit: async ({ value }) => {
      const parsed = categorySchema.safeParse(value);

      if (!parsed.success) return;

      categoryUpdateMutation.mutate(parsed.data);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        if (!state) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* NAME */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = categorySchema.shape.name.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Category Name *"
                placeholder="e.g., Renewable Energy"
              />
            )}
          </form.Field>

          {/* DESCRIPTION */}
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => {
                const result =
                  categorySchema.shape.description.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Description"
                placeholder="Brief description of this category"
                as="textarea"
                className="min-h-45 resize-y"
              />
            )}
          </form.Field>

          {/* FOOTER */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={categoryUpdateMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={categoryUpdateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {categoryUpdateMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategoryDialog;
