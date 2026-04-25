/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getIdeaById } from "@/services/idea.service";
import { IUser } from "@/type/user.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import CommentSection from "./CommentSection";
import VoteControl from "../voting/VoteControl";

import { useEffect } from "react";
import PaymentForm from "@/components/payment/PaymentForm";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

const IdeaDetails = ({ user }: { user: IUser | null }) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const id = params.id as string;
  const currentPath = `/ideas/${id}`;

  const { data: paymentStatus, refetch: refetchPayment } = usePaymentStatus(
    id,
    !!user,
  );

  const isPaid = paymentStatus?.data === true;

  // FETCH IDEA
  const {
    data,
    isLoading,
    refetch: refetchIdea,
  } = useQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdeaById(id),
    enabled: !!id,
  });

  const idea = data?.data ?? null;

  // AUTO-POLLING LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // If payment is successful but content is still hidden, poll for updates
    if (isPaid && idea?.isHidden) {
      interval = setInterval(async () => {
        await Promise.all([refetchIdea(), refetchPayment()]);
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaid, idea?.isHidden, refetchIdea, refetchPayment]);

  // LOADING UI
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  // NOT FOUND
  if (!idea) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Idea Not Found</h2>
        <Link href="/ideas">
          <Button className="mt-4">Back</Button>
        </Link>
      </div>
    );
  }

  // LOCK LOGIC
  const isLocked = idea?.isHidden || (idea.isPaid && !user);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* BACK */}
      <Link
        href="/ideas"
        className={cn(buttonVariants({ variant: "ghost" }), "mb-6")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Link>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div className="space-y-3 flex-1">
          <div className="flex gap-2 flex-wrap">
            <Badge>{idea.category.name}</Badge>

            {idea.isPaid && (
              <Badge className="bg-amber-500 text-white">
                <DollarSign className="h-3 w-3 mr-1" />${idea.price?.toFixed(2)}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{idea.title}</h1>

          <div className="flex gap-4 text-sm text-muted-foreground">
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

        <VoteControl
          ideaId={idea.id}
          initialVoteCount={idea._count.votes}
          userVote={idea.votes?.[0]?.type || null}
          isLoggedIn={!!user}
        />
      </div>

      {/* IMAGE */}
      {idea.imageUrl && (
        <div className="rounded-xl overflow-hidden mb-8">
          <Image
            src={idea.imageUrl}
            alt={idea.title}
            width={900}
            height={500}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* LOCKED SECTION */}
      {isLocked ? (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50" />
          <CardContent className="py-16 text-center space-y-6">
            <div className="bg-amber-100 dark:bg-amber-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
              <Lock className="h-10 w-10 text-amber-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                Premium Idea
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {!user
                  ? "This is a premium idea. Please login to unlock the full solution and implementation details."
                  : `This exclusive content requires a one-time payment of $${idea.price?.toFixed(2)} to unlock.`}
              </p>
            </div>

            {/* LOGIN STATE */}
            {!user ? (
              <div className="flex justify-center gap-3">
                <Link href={`/login?redirect=${currentPath}`}>
                  <Button>Login</Button>
                </Link>

                <Link href={`/register?redirect=${currentPath}`}>
                  <Button variant="secondary">Register</Button>
                </Link>
              </div>
            ) : isPaid ? (
              <div className="py-6 flex flex-col items-center gap-3 text-amber-600 font-medium">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p>Payment confirmed! Unlocking your content...</p>
              </div>
            ) : (
              // 🔥 PAYMENT FORM (REAL STRIPE ELEMENTS)
              <PaymentForm
                ideaId={idea.id}
                onSuccess={async () => {
                  toast.success("Processing payment...");
                  // Invalidate immediately to show the spinner
                  queryClient.invalidateQueries({
                    queryKey: ["payment-status", id],
                  });
                }}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        // UNLOCKED CONTENT
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{idea.problem}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{idea.solution}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{idea.description}</p>
            </CardContent>
          </Card>

          <Separator />
        </div>
      )}

      {/* COMMENTS SECTION */}
      <CommentSection
        ideaId={idea.id}
        comments={idea.comments || []}
        user={user}
      />
    </div>
  );
};

export default IdeaDetails;
