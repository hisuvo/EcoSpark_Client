import { getUserInfo } from "@/services/auth.service";
import Link from "next/link";

export default async function Home() {
  const user = await getUserInfo();

  console.log("this is user information ->", user);
  return (
    <div>
      {/* navigation menu add here */}
      <div className="flex gap-4">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/admin">Admin</Link>
        <Link href="/dashboard/member">Member</Link>
      </div>
      <h1 className="text-5xl">Hello Wrold</h1>
    </div>
  );
}
