"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";
import { getIconComponents } from "@/lib/IconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/type/dashboard.type";
import { IUser } from "@/type/user.type";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardMobileSidebarProps {
  dashboardHome: string;
  userInfo: IUser;
  navItems: NavSection[];
}

const DashboardMobileSidebar = ({
  dashboardHome,
  userInfo,
  navItems,
}: DashboardMobileSidebarProps) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full w-full">
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      {/* Navigation area */}
      <div className="flex-1 overflow-hidden px-3 pt-4">
        <ScrollArea className="h-full">
          <nav>
            {navItems.map((section, sectionId) => (
              <div key={sectionId}>
                {section.title && (
                  <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
                    {section.title}
                  </h4>
                )}

                <div className="space-y-1">
                  {section.items.map((item, id) => {
                    const isAtive = pathname === item.href;
                    const Icon = getIconComponents(item.icon);
                    return (
                      <Link
                        href={item.href}
                        key={id}
                        className={cn(
                          "flex items-center rounded-lg gap-3 px-3 py-2 text-sm font-medium transition-all",
                          isAtive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Icon className="w-4 h-4"></Icon>
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {sectionId < navItems.length - 1 && (
                  <Separator className="my-6" />
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* user information */}
      <div className="border-t p-3 mt-auto">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border flex-shrink-0">
            {userInfo.image ? (
              <Image
                src={userInfo.image}
                alt={userInfo.name}
                width={50}
                height={50}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-primary">
                {userInfo.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-hidden min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">
              {userInfo.name}
            </p>
            <p className="text-xs text-muted-foreground truncate capitalize">
              {userInfo.role.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileSidebar;
