"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, LogOut, History } from "lucide-react";

export default function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          OptiGenius
        </Link>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : session ? (
            <>
              <Link href="/history">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
