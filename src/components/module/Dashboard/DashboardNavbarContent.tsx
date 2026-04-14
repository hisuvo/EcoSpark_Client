"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/type/dashboard.type";
import { IUser } from "@/type/user.type";
import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import UserDropdown from "./UserDropdown";
import Link from "next/link";

interface DashboardNavbarProps {
  userInfo: IUser;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex w-full h-16 items-center border-b">
      {/* Mobile menu Toggle button (Mobile only) */}
      <div className="flex items-center px-4 md:hidden">
        <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-0">
            <DashboardMobileSidebar
              userInfo={userInfo}
              navItems={navItems}
              dashboardHome={dashboardHome}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* logo/brand (Desktop: w-64 to match sidebar, Mobile: hidden) */}
      <div className="hidden md:flex w-64 h-full items-center border-r px-6 bg-card shrink-0">
        <Link href={dashboardHome}>
          <span className="text-xl font-bold text-primary">EcoSpark Hub</span>
        </Link>
      </div>

      {/* Main Navbar Content (Search and Actions) */}
      <div className="flex flex-1 items-center justify-between px-4 h-full gap-4">
        {/* search Component */}
        <div className="flex-1 flex items-center">
          <div className="relative w-full hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 w-full"
            />
          </div>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbarContent;
