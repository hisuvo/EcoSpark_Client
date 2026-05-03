import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string | React.ReactNode;
  description?: string;
  badge?: string;
  badgeIcon?: LucideIcon;
  align?: "center" | "left";
  className?: string;
  children?: React.ReactNode;
}

const SectionHeader = ({
  title,
  description,
  badge,
  badgeIcon: BadgeIcon,
  align = "center",
  className,
  children,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col mb-12 gap-4",
        align === "center"
          ? "text-center items-center"
          : "text-left items-start",
        className,
      )}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" />}
          <span>{badge}</span>
        </div>
      )}

      <h2
        className={cn(
          "text-2xl md:text-3xl font-extrabold tracking-tight",
          align === "center" && "max-w-3xl mx-auto",
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "text-muted-foreground text-lg leading-relaxed",
            align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl",
          )}
        >
          {description}
        </p>
      )}

      {children && (
        <div className={cn("mt-2", align === "center" ? "mx-auto" : "")}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
