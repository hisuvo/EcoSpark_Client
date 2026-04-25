"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Shield, UserX, UserCheck, ShieldAlert, Loader2 } from "lucide-react";
import { IUser } from "@/type/user.type";
import { useUpdateUserStatus, useChangeUserRole } from "@/hooks/useUserManagement";
import { useState } from "react";

interface UserManagementTableProps {
  users: IUser[];
}

export default function UserManagementTable({ users }: UserManagementTableProps) {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();
  const { mutate: changeRole, isPending: isChangingRole } = useChangeUserRole();

  const handleUpdateStatus = (id: string, status: string) => {
    setUpdatingUserId(id);
    updateStatus(
      { id, status },
      {
        onSettled: () => setUpdatingUserId(null),
      }
    );
  };

  const handleChangeRole = (id: string, role: string) => {
    setUpdatingUserId(id);
    changeRole(
      { id, role },
      {
        onSettled: () => setUpdatingUserId(null),
      }
    );
  };

  const getStatusBadge = (status: string) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>;
      case "BLOCKED":
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    if (!role) return <Badge variant="outline">Unknown</Badge>;
    switch (role.toUpperCase()) {
      case "ADMIN":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "MEMBER":
        return <Badge className="bg-blue-500">Member</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-right">
                  {updatingUserId === user.id ? (
                    <div className="flex justify-end pr-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(
                              user.id,
                              user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"
                            )
                          }
                          disabled={isUpdatingStatus || isChangingRole}
                        >
                          {user.status === "ACTIVE" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" /> Block User
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" /> Unblock User
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleChangeRole(
                              user.id,
                              user.role === "ADMIN" ? "MEMBER" : "ADMIN"
                            )
                          }
                          disabled={isUpdatingStatus || isChangingRole}
                        >
                          {user.role === "ADMIN" ? (
                            <>
                              <ShieldAlert className="mr-2 h-4 w-4" /> Demote to Member
                            </>
                          ) : (
                            <>
                              <Shield className="mr-2 h-4 w-4" /> Promote to Admin
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
