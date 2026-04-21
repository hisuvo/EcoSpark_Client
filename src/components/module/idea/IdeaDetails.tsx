"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getIdeaById } from "@/services/idea.service";
import { createCheckoutSession } from "@/services/payment.service";
import { IUser } from "@/type/user.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const IdeaDetails = ({ user }: { user: IUser | null }) => {
  const params = useParams();
  const id = params.id as string;
  const currentPath = `/ideas/${id}`;

  // ✅ query
  const { data, isLoading } = useQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdeaById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // cache 5 min
  });

  const idea = data?.data ?? null;

  // ✅ mutation (typed error safer)
  const paymentMutation = useMutation({
    mutationFn: () => createCheckoutSession(id),
    onSuccess: (res) => {
      if (res?.url) {
        window.open(res.url, "_self");
      }
    },
    onError: (error: unknown) => {
      const message =
        (error as any)?.response?.data?.message || "Failed to initiate payment";
      toast.error(message);
    },
  });

  // ✅ loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // ✅ not found
  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Idea Not Found</h2>
        <Link
          href="/ideas"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Back to Ideas
        </Link>
      </div>
    );
  }

  /**
   * ✅ FIXED LOCK LOGIC (important)
   * - locked if paid AND user not logged in
   * - later you can extend with: !idea.isPurchased
   */
  const isLocked = idea.isPaid && !user;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back */}
      <Link
        href="/ideas"
        className={cn(buttonVariants({ variant: "ghost" }), "mb-6")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Ideas
      </Link>

      {/* Header */}
      <div className="space-y-4 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            {idea.category.name}
          </Badge>

          {idea.isPaid && (
            <Badge className="bg-amber-500 text-white">
              <DollarSign className="h-3 w-3 mr-1" />
              Paid - ${idea.price?.toFixed(2)}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold">{idea.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {idea.author.name}
          </span>

          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(idea.createdAt), "MMM dd, yyyy")}
          </span>
        </div>
      </div>

      {/* Image */}
      {idea.imageUrl && (
        <div className="rounded-xl overflow-hidden mb-8 bg-muted shadow-lg">
          <Image
            src={idea.imageUrl}
            alt={idea.title}
            width={800}
            height={400}
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* 🔒 LOCKED UI */}
      {isLocked ? (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Lock className="h-12 w-12 text-amber-500 mb-4" />

            <h3 className="text-xl font-semibold mb-2">Premium Content</h3>

            {/* ✅ FIXED MESSAGE */}
            <p className="text-muted-foreground mb-6 max-w-md">
              {!user
                ? "This content is locked. Please login or register to access it."
                : `This premium idea costs $${idea.price?.toFixed(
                    2,
                  )}. Unlock it to view full details.`}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {!user ? (
                <>
                  <Link
                    href={`/login?redirect=${encodeURIComponent(currentPath)}`}
                    className={cn(buttonVariants({ variant: "default" }))}
                  >
                    Login
                  </Link>

                  <Link
                    href={`/register?redirect=${encodeURIComponent(currentPath)}`}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "bg-green-600 hover:bg-green-700 text-white",
                    )}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <Button
                  onClick={() => paymentMutation.mutate()}
                  disabled={paymentMutation.isPending}
                  className="bg-amber-600 hover:bg-amber-700 text-white min-w-[160px]"
                >
                  {paymentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Pay ${idea.price?.toFixed(2)}
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Problem */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{idea.problem}</p>
            </CardContent>
          </Card>

          {/* Solution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">
                Proposed Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{idea.solution}</p>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{idea.description}</p>
            </CardContent>
          </Card>

          <Separator />
        </div>
      )}
    </div>
  );
};

export default IdeaDetails;
