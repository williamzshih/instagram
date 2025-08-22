"use client";

import { House, LayoutGrid, LogOut, Plus, Search, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const googleSans = localFont({
  src: "../app/fonts/GoogleSansCodeVF.ttf",
});

export default function DesktopNav() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been signed out");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div
      className={`shadow-muted-foreground/25 border-muted sticky z-10 m-6 hidden h-fit flex-col gap-6 overflow-y-auto rounded-xl border p-4 shadow-md backdrop-blur-md lg:flex ${googleSans.className}`}
    >
      <Button
        className="h-fit w-fit cursor-pointer transition-transform hover:scale-105 hover:bg-transparent"
        variant="ghost"
      >
        <Link className="flex items-center gap-3" href="/">
          <Image
            alt="Instagram logo"
            height={32}
            src={theme === "dark" ? "/logo_light.svg" : "/logo_dark.svg"}
            width={32}
          />
          <Image
            alt="Instagram text"
            className="mt-1"
            height={32}
            src={theme === "dark" ? "/text_light.svg" : "/text_dark.svg"}
            width={90}
          />
        </Link>
      </Button>
      <Button
        className="h-fit w-fit cursor-pointer transition-transform hover:scale-105 hover:bg-transparent"
        variant="ghost"
      >
        <Link className="flex items-center gap-4" href="/">
          <House className="size-8" />
          <p className="text-lg">Home</p>
        </Link>
      </Button>
      <Button
        className="h-fit w-fit cursor-pointer transition-transform hover:scale-105 hover:bg-transparent"
        variant="ghost"
      >
        <Link className="flex items-center gap-4" href="/search">
          <Search className="size-8" />
          <p className="text-lg">Search</p>
        </Link>
      </Button>
      <Button
        className="h-fit w-fit cursor-pointer transition-transform hover:scale-105 hover:bg-transparent"
        variant="ghost"
      >
        <Link className="flex items-center gap-4" href="/create">
          <Plus className="size-8" />
          <p className="text-lg">Create</p>
        </Link>
      </Button>
      <Button
        className="h-fit w-fit cursor-pointer transition-transform hover:scale-105 hover:bg-transparent"
        variant="ghost"
      >
        <Link className="flex items-center gap-4" href="/browse">
          <LayoutGrid className="size-8" />
          <p className="text-lg">Browse</p>
        </Link>
      </Button>
      <Button
        className="h-fit w-fit cursor-pointer transition-transform hover:scale-105 hover:bg-transparent"
        variant="ghost"
      >
        <Link className="flex items-center gap-4" href="/profile">
          <User className="size-8" />
          <p className="text-lg">Profile</p>
        </Link>
      </Button>
      <div className="flex-1" />
      <Button
        className="flex h-fit w-fit cursor-pointer items-center gap-4 transition-transform hover:scale-105 hover:bg-transparent"
        onClick={handleSignOut}
        variant="ghost"
      >
        <LogOut className="size-8" />
        <p className="text-lg">Sign out</p>
      </Button>
    </div>
  );
}
