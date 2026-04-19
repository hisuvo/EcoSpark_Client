"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  className?: string;
}

const LogoutButton = ({ 
  variant = "destructive", 
  size = "default",
  showIcon = true,
  className = ""
}: LogoutButtonProps) => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button 
      onClick={() => logout()} 
      disabled={isPending}
      variant={variant}
      size={size}
      className={`w-full justify-start ${className}`}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;
