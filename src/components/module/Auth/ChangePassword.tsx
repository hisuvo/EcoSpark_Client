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
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

const ChangePasswordForm = () => {
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const mutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      changePasswordService(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Password updated successfully!");
      form.reset();
      setShow({ current: false, new: false, confirm: false });
    },
    onError: (error: any) => {
      console.error(error?.message);
      toast.error("Something went wrong");
    },
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const { currentPassword, newPassword } = value;
      await mutation.mutateAsync({ currentPassword, newPassword });
    },
  });

  const PasswordField = ({
    field,
    typeKey,
    label,
  }: {
    field: any;
    typeKey: "current" | "new" | "confirm";
    label: string;
  }) => {
    return (
      <div className="space-y-1">
        <div className="relative">
          <AppField
            field={field}
            label={label}
            type={show[typeKey] ? "text" : "password"}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="pr-10"
          />

          <button
            type="button"
            onClick={() =>
              setShow((prev) => ({
                ...prev,
                [typeKey]: !prev[typeKey],
              }))
            }
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-700 transition"
          >
            {show[typeKey] ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[80vh] px-4">
      <Card className="shadow-sm border">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gray-100">
              <Lock className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          <CardTitle className="text-2xl font-semibold">
            Change Password
          </CardTitle>

          <CardDescription className="text-sm text-gray-500">
            Keep your account secure by updating your password regularly
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            {/* Current Password */}
            <form.Field name="currentPassword">
              {(field) => (
                <PasswordField
                  field={field}
                  typeKey="current"
                  label="Current Password"
                />
              )}
            </form.Field>

            {/* New Password */}
            <form.Field name="newPassword">
              {(field) => (
                <PasswordField
                  field={field}
                  typeKey="new"
                  label="New Password"
                />
              )}
            </form.Field>

            {/* Confirm Password */}
            <form.Field
              name="confirmPassword"
              validators={{
                onChangeListenTo: ["newPassword"],
                onChange: ({ value, fieldApi }) => {
                  const newPassword =
                    fieldApi.form.getFieldValue("newPassword");
                  if (value !== newPassword) {
                    return "Passwords do not match";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <PasswordField
                  field={field}
                  typeKey="confirm"
                  label="Confirm Password"
                />
              )}
            </form.Field>

            {/* Submit */}
            <form.Subscribe selector={(state) => [state.canSubmit]}>
              {([canSubmit]) => (
                <AppSubmitButton
                  isSubmitting={mutation.isPending}
                  disabled={!canSubmit || mutation.isPending}
                  className="w-full h-11 rounded-lg text-base font-medium"
                >
                  {mutation.isPending ? "Updating..." : "Update Password"}
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;
