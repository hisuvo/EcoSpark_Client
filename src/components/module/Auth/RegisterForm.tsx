"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import AppField from "@/shared/form/AppField";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import {
  IRegisterPayload,
  RegisterAction,
} from "@/app/(commonLayout)/(auth)/register/_action";
import AppSubmitButton from "@/shared/form/AppSubmitButton";
import { toast } from "sonner";

// Zod Schema
const registerSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(3, "Name must be at least 3 characters long"),
  email: z.string("Email is required").trim().email("Invalid email address"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

interface RegisterFormProps {
  redirectpath?: string;
}

export default function RegisterForm({ redirectpath }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (payload: IRegisterPayload) =>
      RegisterAction(payload, redirectpath),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await registerMutation.mutateAsync(value);

        if (!response.success) {
          toast.error(response.message || "Login failed!");
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(`Login failed : ${error.message}`);
      }
    },
  });

  return (
    <Card className="max-w-md mx-auto my-10 border p-6 rounded-lg">
      <CardTitle className="text-xl font-semibold mb-4">
        Create Account{" "}
      </CardTitle>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Name */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.name.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <AppField field={field} label="Name" placeholder="Enter name" />
            )}
          </form.Field>

          {/* Email */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.email.safeParse(value);
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
                const result = registerSchema.shape.password.safeParse(value);
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
                  placeholder="Create password"
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

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit]) => (
              <AppSubmitButton
                isSubmitting={registerMutation.isPending}
                loadingText="Registation process..."
                disabled={!canSubmit || registerMutation.isPending}
                className="w-full"
              >
                Register
              </AppSubmitButton>
            )}
          </form.Subscribe>

          {registerMutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {registerMutation.error instanceof Error
                ? registerMutation.error.message
                : "An error occurred"}
            </p>
          )}

          {registerMutation.data && !registerMutation.data.success && (
            <p className="text-red-500 text-sm text-center">
              {registerMutation.data.message}
            </p>
          )}
        </form>
      </CardContent>

      <CardFooter className="justify-center bg-transparent">
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
