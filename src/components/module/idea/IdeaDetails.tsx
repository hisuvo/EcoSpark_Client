/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const currentPath = `/ideas/${params.id}`;

  const id = params.id as string;
  const { data: ideaData, isLoading: ideaLoading } = useQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdeaById(id),
  });

  const paymentMutation = useMutation({
    mutationFn: () => createCheckoutSession(id),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to initiate payment",
      );
    },
  });

  const idea = ideaData?.data;

  if (ideaLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

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

  const isLocked = idea.isPaid && !user;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
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
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200">
            {idea.category.name}
          </Badge>
          {idea.isPaid && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
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

        {/* <VoteButtons
          ideaId={idea.id}
          upvotes={idea.upvotes}
          downvotes={idea.downvotes}
          userVote={idea.userVote}
        /> */}
      </div>

      {/* Image */}
      {idea.imageUrl && (
        <div className="rounded-xl overflow-hidden mb-8 bg-muted shadow-lg">
          <Image
            src={idea.imageUrl}
            alt={idea.title}
            width={500}
            height={400}
            className="w-full max-h-125 object-cover"
          />
        </div>
      )}

      {isLocked ? (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Lock className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {user
                ? `This premium idea costs $${idea.price?.toFixed(2)}. Unlock it to view the full problem statement, solution, and high-resolution details.`
                : `This content is locked. You need to pay $${idea.price?.toFixed(2)} to access the full details. Please login or register to proceed.`}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {user ? (
                <Button
                  onClick={() => paymentMutation.mutate()}
                  disabled={paymentMutation.isPending}
                  className="bg-amber-600 hover:bg-amber-700 text-white min-w-[150px]"
                >
                  {paymentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Pay $${idea.price?.toFixed(2)}
                    </>
                  )}
                </Button>
              ) : (
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
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Problem Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-600 dark:text-red-400">
                Problem Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {idea.problem}
              </p>
            </CardContent>
          </Card>

          {/* Proposed Solution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-600 dark:text-green-400">
                Proposed Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {idea.solution}
              </p>
            </CardContent>
          </Card>

          {/* Detailed Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Detailed Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {idea.description}
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Comments */}
          {/* <CommentSection ideaId={idea.id} initialComments={comments} /> */}
        </div>
      )}
    </div>
  );
};

export default IdeaDetails;
