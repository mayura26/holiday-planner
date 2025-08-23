"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, BarChart, LogIn } from "lucide-react";

export function HeaderButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex gap-2">
        <Link href="/summary">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Summary
          </Button>
        </Link>
        <Button disabled className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link href="/summary">
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          Summary
        </Button>
      </Link>
      {session ? (
        <Link href="/editor">
          <Button className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Schedule
          </Button>
        </Link>
      ) : (
        <Button onClick={() => signIn()} variant="default" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Sign In to Edit
        </Button>
      )}
    </div>
  );
}
