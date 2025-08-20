"use client";

import { House, LayoutGrid, LogOut, Plus, Search, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const googleSans = localFont({
  src: "../app/fonts/GoogleSansCodeVF.ttf",
});

export default function DesktopNav() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return;

  return (
    <div
      className={`hidden lg:flex flex-col gap-6 p-4 h-[calc(100vh-48px)] sticky inset-6 shadow-md shadow-muted-foreground/25 rounded-xl backdrop-blur-md overflow-y-auto z-10 ${googleSans.className}`}
    >
      <Button
        className="w-fit h-fit cursor-pointer hover:bg-transparent hover:scale-105 transition-transform"
        variant="ghost"
      >
        <Link className="flex items-center gap-2" href="/">
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
            width={96}
          />
        </Link>
      </Button>
      <Button
        className="w-fit h-fit cursor-pointer hover:bg-transparent hover:scale-105 transition-transform"
        variant="ghost"
      >
        <Link className="flex items-center gap-4" href="/">
          <House />
          <p className="text-lg">Home</p>
        </Link>
      </Button>
      <Button
        className="w-fit h-fit cursor-pointer hover:bg-transparent hover:scale-105 transition-transform"
        variant="ghost"
      >
        <Link className="flex items-center gap-4" href="/search">
          <Search />
          <p className="text-lg">Search</p>
        </Link>
      </Button>
      <Button
        className="w-fit h-fit cursor-pointer hover:bg-transparent hover:scale-105 transition-transform"
        variant="ghost"
      >
        <Link className="flex items-center gap-4" href="/create">
          <Plus />
          <p className="text-lg">Create</p>
        </Link>
      </Button>
      <Button
        className="w-fit h-fit cursor-pointer hover:bg-transparent hover:scale-105 transition-transform"
        variant="ghost"
      >
        <Link className="flex items-center gap-4" href="/browse">
          <LayoutGrid />
          <p className="text-lg">Browse</p>
        </Link>
      </Button>
      <Button
        className="w-fit h-fit cursor-pointer hover:bg-transparent hover:scale-105 transition-transform"
        variant="ghost"
      >
        <Link className="flex items-center gap-4" href="/profile">
          <User />
          <p className="text-lg">Profile</p>
        </Link>
      </Button>
      <div className="flex-1" />
      <Button
        className="w-fit h-fit cursor-pointer hover:bg-transparent hover:scale-105 transition-transform flex items-center gap-4"
        onClick={() => signOut()}
        variant="ghost"
      >
        <LogOut />
        <p className="text-lg">Sign out</p>
      </Button>
    </div>
  );
}
