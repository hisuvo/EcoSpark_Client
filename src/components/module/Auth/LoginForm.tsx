"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import AppField from "@/shared/form/AppField";
import AppSubmitButton from "@/shared/form/AppSubmitButton";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

import { loginAction } from "@/app/(commonLayout)/(auth)/login/_action";
import { ILoginPayload } from "@/zod/auth.validation";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Zod Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters required"),
});

interface LoginFormProps {
  redirectpath?: string;
}

export default function LoginForm({ redirectpath }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectpath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await mutation.mutateAsync(value);

        if (!response.success) {
          setError(response.message || "Login failed!");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(`Login failed : ${error.message}`);
      }
    },
  });

  return (
    <Card className="max-w-md mx-auto my-10 border p-6 rounded-lg">
      <CardTitle className="text-xl font-semibold mb-4">Login</CardTitle>

      <CardContent>
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Email */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = loginSchema.shape.email.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter email"
              />
            )}
          </form.Field>

          {/* Password */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const result = loginSchema.shape.password.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="relative">
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                />

                <Button
                  variant={"ghost"}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-sm text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            )}
          </form.Field>

          <div className="my-2">
            <Link href={"/forget-password"} className="text-sm">
              Forget Password!
            </Link>
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit]) => (
              <AppSubmitButton
                isSubmitting={mutation.isPending}
                loadingText="Logging in..."
                disabled={!canSubmit || mutation.isPending}
                className="w-full"
              >
                Login
              </AppSubmitButton>
            )}
          </form.Subscribe>

          {mutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "An error occurred"}
            </p>
          )}

          {mutation.data && !mutation.data.success && (
            <p className="text-red-500 text-sm text-center">
              {mutation.data.message}
            </p>
          )}
        </form>
      </CardContent>

      <CardFooter className="justify-center bg-transparent">
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
