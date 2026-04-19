/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import AppField from "@/shared/form/AppField";
import AppSubmitButton from "@/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IVerifyEmailPayload, verifyEmailSchema } from "@/zod/auth.validation";
import { verifyEmailService } from "@/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // Safety redirect if email is missing
  useEffect(() => {
    if (!email) {
      toast.error("Invalid verification request. Please register again.");
      router.push("/register");
    }
  }, [email, router]);

  // Verification Mutation
  const verifyMutation = useMutation({
    mutationFn: async (payload: IVerifyEmailPayload) =>
      verifyEmailService(payload),

    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Verification successful!");
        router.push("/login");
      } else {
        toast.error(data.message || "Verification failed");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred during verification");
    },
  });

  // TanStack Form
  const form = useForm({
    defaultValues: {
      email: email || "",
      otp: "",
    } as IVerifyEmailPayload,
    onSubmit: async ({ value }) => {
      // Double check email before submission
      if (!value.email) {
        toast.error("Email is missing. Redirecting...");
        router.push("/register");
        return;
      }
      verifyMutation.mutate(value);
    },
  });

  // If email is missing, show a loading state while redirecting
  if (!email) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12 px-4 animate-in fade-in duration-700">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-card/40 backdrop-blur-md overflow-hidden ring-1 ring-border/50">
        <div className="h-1.5 bg-linear-to-r from-primary/30 via-primary to-primary/30" />
        <CardHeader className="text-center space-y-6 pt-12">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center group transition-all duration-500 hover:bg-primary/20">
            {verifyMutation.isPending ? (
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            ) : (
              <Mail className="w-10 h-10 text-primary transition-transform duration-500 group-hover:scale-110" />
            )}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Verify your account
            </CardTitle>
            <CardDescription className="text-base max-w-70 mx-auto leading-relaxed">
              We&apos;ve sent a 6-digit verification code to{" "}
              <span className="font-semibold text-foreground">{email}</span>.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            <form.Field
              name="otp"
              validators={{
                onChange: ({ value }) => {
                  const result = verifyEmailSchema.shape.otp.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full">
                    <AppField
                      field={field}
                      label="Verification Code"
                      placeholder="------"
                      className="text-center text-3xl font-mono font-bold tracking-[0.6em] h-16 bg-background/50 border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary transition-all uppercase placeholder:opacity-30"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 animate-pulse">
                    <KeyRound className="w-3 h-3 text-primary/60" />
                    Enter the digits precisely as they appear in your inbox.
                  </p>
                </div>
              )}
            </form.Field>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit]) => (
                <AppSubmitButton
                  isSubmitting={verifyMutation.isPending}
                  loadingText="Validating Code..."
                  disabled={!canSubmit || verifyMutation.isPending}
                  className="w-full h-12 text-base font-bold shadow-xl shadow-primary/10 transition-all hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] bg-primary text-primary-foreground"
                >
                  Verify Account
                </AppSubmitButton>
              )}
            </form.Subscribe>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-dashed border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-card/40 px-3 text-muted-foreground font-semibold backdrop-blur-md">
                  Trouble receiving code?
                </span>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pb-12 px-12">
          <Button
            variant="ghost"
            asChild
            className="w-full text-muted-foreground hover:text-primary transition-colors text-center"
          >
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
