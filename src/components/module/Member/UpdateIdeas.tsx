/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ArrowLeft, AlertCircle, X, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { getCategories } from "@/services/categories.service";
import { getIdeaById, updateIdea } from "@/services/idea.service";
import { ICategory } from "@/type/category.type";
import AppField from "@/shared/form/AppField";
import { ApiResponse } from "@/type/api.type";
import Image from "next/image";
import { uploadImage } from "@/lib/uploadImage";
import { useRef, useState } from "react";

export const updateIdeaSchema = z.object({
  title: z.string().min(5).optional(),

  problem: z
    .string()
    .min(20)
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  solution: z
    .string()
    .min(20)
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  description: z
    .string()
    .min(30)
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  imageUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  categoryId: z
    .string()
    .min(1)
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  isPaid: z.boolean().optional(),

  price: z.coerce.number().min(0).optional(),
});

export default function UpdateIdeas() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: ideaResponse, isLoading: ideaLoading } = useQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdeaById(id),
  });

  const idea = ideaResponse?.data;

  const { data: categoriesResponse } = useQuery<ApiResponse<ICategory[]>>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const categories = categoriesResponse?.data || [];

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateIdea(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea", id] });
      toast.success("Idea updated successfully!");
      router.push("/dashboard/member/ideas");
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to update idea";
      toast.error(errorMsg);
    },
  });

  const form = useForm({
    defaultValues: {
      title: idea?.title || "",
      problem: idea?.problem || "",
      solution: idea?.solution || "",
      description: idea?.description || "",
      imageUrl: idea?.imageUrl || "",
      categoryId: idea?.categoryId || "",
      isPaid: idea?.isPaid || false,
      price: idea?.price || 0,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        title: value.title,
        problem: value.problem,
        solution: value.solution,
        description: value.description,
        categoryId: value.categoryId,
      } as any;

      if (value.imageUrl?.trim()) {
        payload.imageUrl = value.imageUrl;
      }

      if (value.isPaid && value.price && value.price > 0) {
        payload.isPaid = true;
        payload.price = value.price;
      }

      console.log("Update payload:", JSON.stringify(payload, null, 2));
      await updateMutation.mutateAsync(payload);
    },
  });

  if (ideaLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/member/ideas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Ideas
          </Link>
        </Button>
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-lg text-muted-foreground">Idea not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = idea.status === "DRAFT" || idea.status === "REJECTED";

  if (!canEdit) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/member/ideas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Ideas
          </Link>
        </Button>
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-300">
            This idea cannot be edited because it is currently{" "}
            <strong>
              {idea.status === "UNDER_REVIEW"
                ? "under review"
                : idea.status === "APPROVED"
                  ? "approved"
                  : "rejected"}
            </strong>
            . Only draft and rejected ideas can be edited.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/dashboard/member/ideas">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Ideas
        </Link>
      </Button>

      {idea.status === "REJECTED" && idea.feedback && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-300">
            <strong>Admin Feedback:</strong> {idea.feedback}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Idea</CardTitle>
          <CardDescription>
            Update your idea and resubmit it for review. Status:{" "}
            <strong>{idea.status}</strong>
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
                  const result = updateIdeaSchema.shape.title.safeParse(value);
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
                  const result =
                    updateIdeaSchema.shape.categoryId.safeParse(value);
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
                  const result =
                    updateIdeaSchema.shape.problem.safeParse(value);
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
                  const result =
                    updateIdeaSchema.shape.solution.safeParse(value);
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
                  const result =
                    updateIdeaSchema.shape.description.safeParse(value);
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
                  const result =
                    updateIdeaSchema.shape.imageUrl.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => {
                return (
                  <div className="space-y-3">
                    <Label>Upload Image</Label>

                    <Card className="border-dashed border-2 hover:border-primary transition">
                      <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
                        {/* Hidden input */}
                        <input
                          ref={inputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            try {
                              setUploading(true); // ✅ start loading

                              const url = await uploadImage(file);

                              if (url) {
                                field.handleChange(url);
                              }
                            } finally {
                              setUploading(false); // ✅ stop loading
                            }
                          }}
                        />

                        {/* Button */}
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={uploading}
                          onClick={() => inputRef.current?.click()}
                        >
                          {uploading ? "Uploading..." : "Choose Image"}
                        </Button>

                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, JPEG (max 32MB)
                        </p>

                        {/* 🔥 Uploading State */}
                        {uploading && (
                          <p className="text-sm text-blue-500 animate-pulse">
                            Uploading image...
                          </p>
                        )}

                        {/* Preview */}
                        {field.state.value && !uploading && (
                          <div className="relative mt-4">
                            <Image
                              src={field.state.value}
                              alt="preview"
                              width={140}
                              height={140}
                              className="rounded-lg border object-cover"
                            />

                            <button
                              type="button"
                              onClick={() => field.handleChange("")}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Error */}
                    {field.state.meta.errors?.[0] && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                );
              }}
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
                        const result =
                          updateIdeaSchema.shape.price.safeParse(value);
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
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={!canSubmit || updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Update Idea
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
