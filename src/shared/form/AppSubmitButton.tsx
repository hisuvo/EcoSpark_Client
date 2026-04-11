"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type AppSubmitButtonProps = {
  children: ReactNode;
  isSubmitting?: boolean;
  loadingText?: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
};

export default function AppSubmitButton({
  children,
  isSubmitting = false,
  loadingText,
  className,
  variant = "default",
  size = "default",
  disabled = false,
}: AppSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting || disabled}
      className={className}
      variant={variant}
      size={size}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

