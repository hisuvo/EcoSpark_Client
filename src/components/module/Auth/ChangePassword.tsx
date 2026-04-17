/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { changePasswordService } from "@/services/auth.service";
import AppField from "@/shared/form/AppField";
import AppSubmitButton from "@/shared/form/AppSubmitButton";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import z from "zod";

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Minimum 6 characters"),
    newPassword: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Minimum 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ChangePasswordForm = () => {
  const [error, setError] = useState<string | null>(null);

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const mutation = useMutation({
    mutationFn: (payload: z.infer<typeof ChangePasswordSchema>) =>
      changePasswordService(payload),
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await mutation.mutateAsync(value);
      } catch (error: any) {
        setError(`Change password failed: ${error.message}`);
      }
    },
  });

  const PasswordToggle = ({
    field,
    typeKey,
  }: {
    field: any;
    typeKey: "current" | "new" | "confirm";
  }) => {
    return (
      <div className="relative">
        <AppField
          field={field}
          label={field.name}
          type={show[typeKey] ? "text" : "password"}
          placeholder={`Enter ${field.name}`}
        />

        <Button
          variant="ghost"
          type="button"
          onClick={() =>
            setShow((prev) => ({ ...prev, [typeKey]: !prev[typeKey] }))
          }
          className="absolute right-3 top-8 text-muted-foreground"
        >
          {show[typeKey] ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password for account security
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Current Password */}
          <form.Field name="currentPassword">
            {(field) => <PasswordToggle field={field} typeKey="current" />}
          </form.Field>

          {/* New Password */}
          <form.Field name="newPassword">
            {(field) => <PasswordToggle field={field} typeKey="new" />}
          </form.Field>

          {/* Confirm Password */}
          <form.Field
            name="confirmPassword"
            validators={{
              onChangeListenTo: ["newPassword"],
              onChange: ({ value, fieldApi }) => {
                const newPassword = fieldApi.form.getFieldValue("newPassword");

                if (value !== newPassword) {
                  return "Passwords do not match";
                }

                return undefined;
              },
            }}
          >
            {(field) => <PasswordToggle field={field} typeKey="confirm" />}
          </form.Field>

          {/* Submit */}
          <form.Subscribe selector={(state) => [state.canSubmit]}>
            {([canSubmit]) => (
              <AppSubmitButton
                isSubmitting={mutation.isPending}
                disabled={!canSubmit || mutation.isPending}
                className="w-full"
              >
                Change Password
              </AppSubmitButton>
            )}
          </form.Subscribe>

          {/* Errors */}
          {mutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Something went wrong"}
            </p>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
