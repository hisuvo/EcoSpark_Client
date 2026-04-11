"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AnyFieldApi } from "@tanstack/react-form";

type InputFieldProps = {
  field: AnyFieldApi;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
};

export default function AppField({
  field,
  label,
  type = "text",
  placeholder,
  className,
}: InputFieldProps) {
  const error = field.state.meta.errors?.[0];

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <Label htmlFor={field.name} className="text-sm font-medium">
          {label}
        </Label>
      )}

      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        className={cn(
          "w-full h-11 rounded-xl border bg-white px-3 py-2 text-sm",
          error && "border-red-500 focus-visible:ring-red-500",
          className,
        )}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
