import { NavSection } from "@/type/dashboard.type";
import { UserRole } from "@/type/role.type";

export const getCommonNavItems = (): NavSection[] => {
  return [
    {
      items: [
        {
          label: "Home",
          href: "/",
          icon: "Home",
        },
        {
          label: "My Profile",
          href: "/my-profile",
          icon: "User",
        },
      ],
    },
  ];
};

const getSettingsNavItems = (): NavSection[] => {
  return [
    {
      title: "Settings",
      items: [
        {
          label: "Change Password",
          href: "/change-password",
          icon: "Settings",
        },
      ],
    },
  ];
};

export const AdminNavItems: NavSection[] = [
  {
    title: "Admin Dashboard",
    items: [
      {
        label: "Overview",
        href: "/dashboard/admin",
        icon: "LayoutDashboard",
      },
      {
        label: "Manage Ideas",
        href: "/dashboard/admin/ideas",
        icon: "ClipboardList",
      },
      {
        label: "Manage Users",
        href: "/dashboard/admin/users",
        icon: "Users",
      },
      {
        label: "Categories",
        href: "/dashboard/admin/categories",
        icon: "FolderOpen",
      },
    ],
  },
];

export const MemberNavItems: NavSection[] = [
  {
    title: "Member Dashboard",
    items: [
      {
        label: "Overview",
        href: "/dashboard/member",
        icon: "LayoutDashboard",
      },
      {
        label: "My Ideas",
        href: "/dashboard/member/ideas",
        icon: "Lightbulb",
      },
      {
        label: "Create Idea",
        href: "/dashboard/member/ideas/create",
        icon: "PlusCircle",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole) => {
  const commonNavItems = getCommonNavItems();
  const settingsNavItems = getSettingsNavItems();

  switch (role) {
    case "ADMIN":
      return [...commonNavItems, ...AdminNavItems, ...settingsNavItems];
    case "MEMBER":
      return [...commonNavItems, ...MemberNavItems, ...settingsNavItems];
    case "COMMON":
      return commonNavItems;
    default:
      return [];
  }
};
