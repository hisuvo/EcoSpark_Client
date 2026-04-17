"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, Shield, User } from "lucide-react";
import { format } from "date-fns";
import { IUser } from "@/type/user.type";

interface UserProfileProps {
  user: IUser;
}

const Profile = ({ user }: UserProfileProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-sm border">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">My Profile</CardTitle>
            <CardDescription>
              Manage your personal account details
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline">{user.role}</Badge>
            <Badge
              className={
                user.status === "ACTIVE"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : ""
              }
            >
              {user.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Profile Header */}
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 border">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="text-xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl font-semibold leading-tight">
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Separator />

          {/* Account Info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Account Information
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoItem icon={<User />} label="Full Name" value={user.name} />
              <InfoItem icon={<Mail />} label="Email" value={user.email} />
              <InfoItem
                icon={<Shield />}
                label="Account Status"
                value={user.status}
              />
              <InfoItem
                icon={<Calendar />}
                label="Joined Date"
                value={format(new Date(user.createdAt), "PPP")}
              />
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Metadata
            </h3>

            <div className="grid gap-5 md:grid-cols-2 text-sm">
              <InfoItem label="User ID" value={user.id} mono />
              <InfoItem
                label="Last Updated"
                value={format(new Date(user.updatedAt), "PPP p")}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

/* Reusable component */
const InfoItem = ({
  icon,
  label,
  value,
  mono = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) => {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="mt-1 text-muted-foreground">{icon}</div>}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`font-medium ${mono ? "font-mono text-xs" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
};
