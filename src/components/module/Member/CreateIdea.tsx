/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { getCategories } from "@/services/categories.service";
import { IdeaStatus } from "@/type/idea.type";
import { createIdea } from "@/services/idea.service";
import { useForm } from "@tanstack/react-form";
import { ICategory } from "@/type/category.type";
import AppField from "@/shared/form/AppField";
import AppSubmitButton from "@/shared/form/AppSubmitButton";
import { ApiResponse } from "@/type/api.type";
import Image from "next/image";
import { uploadImage } from "@/lib/uploadImage";

export const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  problem: z.string().min(20, "Problem must be at least 20 characters"),
  solution: z.string().min(20, "Solution must be at least 20 characters"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  imageUrl: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  isPaid: z.boolean().default(false),
  price: z.coerce.number().optional(),
});

type IdeaFormValues = z.infer<typeof ideaSchema>;

export default function CreateIdeaPage() {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<IdeaStatus>("UNDER_REVIEW");

  const { data: categoriesResponse } = useQuery<ApiResponse<ICategory[]>>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const categories = categoriesResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => createIdea(data),
    onSuccess: () => {
      toast.success("Idea created successfully!");
      router.push("/dashboard/member/ideas");
    },
    onError: (error: any) => {
      console.error("Create idea error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to create idea";
      toast.error(errorMsg);
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      problem: "",
      solution: "",
      description: "",
      imageUrl: "",
      categoryId: "",
      isPaid: false,
      price: 0,
    },
    onSubmit: async ({ value }) => {
      console.log("create idea ->", value);

      const payload = {
        title: value.title,
        problem: value.problem,
        solution: value.solution,
        description: value.description,
        categoryId: value.categoryId,
      } as any;

      // Only add imageUrl if it's not empty
      if (value.imageUrl?.trim()) {
        payload.imageUrl = value.imageUrl;
      }

      // Only add isPaid and price if it's a paid idea
      if (value.isPaid && value.price && value.price > 0) {
        payload.isPaid = true;
        payload.price = value.price;
      }

      await createMutation.mutateAsync(payload as any);
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost">
        <Link href="/dashboard/member/ideas">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Ideas
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Idea</CardTitle>
          <CardDescription>
            Share your sustainability idea with the community. You can save it
            as a draft or submit it for review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Title */}
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) => {
                  const result = ideaSchema.shape.title.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Title *"
                  placeholder="Give your idea a clear title"
                />
              )}
            </form.Field>

            {/* Category */}
            <form.Field
              name="categoryId"
              validators={{
                onChange: ({ value }) => {
                  const result = ideaSchema.shape.categoryId.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: ICategory) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Problem */}
            <form.Field
              name="problem"
              validators={{
                onChange: ({ value }) => {
                  const result = ideaSchema.shape.problem.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="problem">Problem Statement *</Label>
                  <Textarea
                    id="problem"
                    placeholder="Describe the environmental problem this idea addresses..."
                    rows={4}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={
                      field.state.meta.errors?.[0] ? "border-red-500" : ""
                    }
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Solution */}
            <form.Field
              name="solution"
              validators={{
                onChange: ({ value }) => {
                  const result = ideaSchema.shape.solution.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="solution">Proposed Solution *</Label>
                  <Textarea
                    id="solution"
                    placeholder="Describe your proposed solution..."
                    rows={4}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={
                      field.state.meta.errors?.[0] ? "border-red-500" : ""
                    }
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Description */}
            <form.Field
              name="description"
              validators={{
                onChange: ({ value }) => {
                  const result = ideaSchema.shape.description.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of your idea..."
                    rows={6}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={
                      field.state.meta.errors?.[0] ? "border-red-500" : ""
                    }
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Image URL */}
            <form.Field
              name="imageUrl"
              validators={{
                onChange: ({ value }) => {
                  const result = ideaSchema.shape.imageUrl.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label>Upload Image *</Label>

                  {/* File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const url = await uploadImage(file);

                      if (url) {
                        field.handleChange(url); // ✅ set image URL into form
                      }
                    }}
                  />

                  {/* Preview */}
                  {field.state.value && (
                    <Image
                      src={field.state.value}
                      alt="preview"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}

                  {/* Error */}
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Paid Idea Toggle */}
            <form.Field name="isPaid">
              {(field) => (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isPaid"
                      checked={field.state.value}
                      onCheckedChange={(checked) => {
                        field.handleChange(checked as boolean);
                      }}
                    />
                    <Label htmlFor="isPaid" className="cursor-pointer">
                      This is a paid idea
                    </Label>
                  </div>
                </div>
              )}
            </form.Field>

            {/* Price */}
            <form.Subscribe selector={(state) => [state.values.isPaid]}>
              {([isPaid]) =>
                isPaid ? (
                  <form.Field
                    name="price"
                    validators={{
                      onChange: ({ value }) => {
                        const result = ideaSchema.shape.price.safeParse(value);
                        return result.success
                          ? undefined
                          : result.error.issues[0].message;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2 ml-6">
                        <AppField
                          field={field}
                          label="Price ($) *"
                          type="number"
                          placeholder="9.99"
                        />
                      </div>
                    )}
                  </form.Field>
                ) : null
              }
            </form.Subscribe>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit]) => (
                  <>
                    <Button
                      type="submit"
                      variant="outline"
                      className="flex-1"
                      disabled={!canSubmit || createMutation.isPending}
                      onClick={() => setSubmitStatus("DRAFT")}
                    >
                      {createMutation.isPending && submitStatus === "DRAFT" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Save as Draft
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={!canSubmit || createMutation.isPending}
                      onClick={() => setSubmitStatus("UNDER_REVIEW")}
                    >
                      {createMutation.isPending &&
                      submitStatus === "UNDER_REVIEW" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Submit for Review
                    </Button>
                  </>
                )}
              </form.Subscribe>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
