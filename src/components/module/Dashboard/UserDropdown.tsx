import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IUser } from "@/type/user.type";
import { Key, LogOut, User } from "lucide-react";
import Link from "next/link";
import LogoutButton from "../Auth/LogoutButton";

interface UserDropdownProps {
   userInfo: IUser
}
// user dropdown create using shadcn ui and here show dashboare inside right 
// side okey
const UserDropdown = ({userInfo}: UserDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <span>
            {userInfo?.name?.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
            <div className="flex flex-col">
              <p className="text-sm font-medium uppercase">{userInfo?.name}</p>
              <p className="text-xs text-muted-foreground">{userInfo?.email}</p>
              <p className="text-xs text-muted-foreground">{userInfo?.role.toLocaleLowerCase().replace("_", " ")}</p>
            </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/my-profile" className="flex items-center gap-2">
          <User className="w-4 h-4 mr-2" />
          Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href="/change-password" className="flex items-center gap-2">
          <Key className="w-4 h-4 mr-2" />
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator/>

        <DropdownMenuItem asChild className="cursor-pointer">
          <LogoutButton />
        </DropdownMenuItem>
    </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;