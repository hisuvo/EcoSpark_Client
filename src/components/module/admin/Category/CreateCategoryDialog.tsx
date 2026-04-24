/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Loader2, PlusCircle } from "lucide-react";
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

import { createCategory } from "@/services/categories.service";
import AppField from "@/shared/form/AppField";
import { toast } from "sonner";

/* ---------------- ZOD SCHEMA ---------------- */

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().min(1, "Description is required").max(500),
});

const CreateCategoryDialog = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const categoryCreateMutation = useMutation({
    mutationFn: (data: any) => createCategory(data),
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create category");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },

    onSubmit: async ({ value }) => {
      const parsed = categorySchema.safeParse(value);

      if (!parsed.success) return;

      categoryCreateMutation.mutate(parsed.data);
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
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
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
              disabled={categoryCreateMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={categoryCreateMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {categoryCreateMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
