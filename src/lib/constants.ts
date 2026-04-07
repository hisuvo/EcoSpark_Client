export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "EcoSpark Hub";

export const IDEA_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const IDEA_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  UNDER_REVIEW:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Ideas", href: "/ideas" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
] as const;

export const ITEMS_PER_PAGE = 12;
