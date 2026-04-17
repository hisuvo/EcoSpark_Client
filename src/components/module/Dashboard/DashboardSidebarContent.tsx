"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getIconComponents } from "@/lib/IconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/type/dashboard.type";
import { IUser } from "@/type/user.type";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarContentProps {
  userInfo: IUser;
  navItems: NavSection[];
  DashboardHome: string;
}

const DashboardSidebarContent = ({
  userInfo,
  navItems,
  DashboardHome,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  return (
    <div className="hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col border-r bg-card sticky top-16">
      {/* Navigation area */}
      <div className="flex-1 overflow-hidden px-3">
        <ScrollArea className="h-full">
          <nav className="space-y-6 pt-4">
            {navItems.map((section, sectionId) => (
              <div key={sectionId}>
                {section.title && (
                  <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h4>
                )}

                <div className="space-y-1">
                  {section.items.map((item, id) => {
                    const isActive = pathname === item.href;
                    const Icon = getIconComponents(item.icon);

                    return (
                      <Link
                        href={item.href}
                        key={id}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* separator here */}
                {sectionId < navItems.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* user info at bottom */}
      <div className="flex items-center gap-3 border-t p-4 mt-auto">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
          {userInfo.image ? (
            <img
              src={userInfo.image}
              alt={userInfo.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-primary">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-semibold truncate text-foreground">
            {userInfo.name}
          </p>
          <p className="text-xs text-muted-foreground truncate capitalize">
            {userInfo.role.toLocaleLowerCase().replace("_", " ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebarContent;
