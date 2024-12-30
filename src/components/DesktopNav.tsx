"use client";

import { House, Search, Plus, LayoutGrid, User } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function DesktopNav() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="hidden md:flex flex-col gap-4 p-4 h-screen sticky inset-0 shadow-md shadow-muted-foreground">
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src={
                theme === "dark"
                  ? "/Instagram_Glyph_White.svg"
                  : "/Instagram_Glyph_Black.svg"
              }
              alt="Instagram logo"
              width={32}
              height={32}
            />
            <Image
              src={
                theme === "dark"
                  ? "/Instagram_logo_white.svg"
                  : "/Instagram_logo_black.svg"
              }
              alt="Instagram text"
              width={100}
              height={100}
              className="mt-1"
            />
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/">
          <div className="flex items-center gap-4">
            <House size={32} />
            <p className="text-lg">Home</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/search">
          <div className="flex items-center gap-4">
            <Search size={32} />
            <p className="text-lg">Search</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/create">
          <div className="flex items-center gap-4">
            <Plus size={32} />
            <p className="text-lg">Create</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/browse">
          <div className="flex items-center gap-4">
            <LayoutGrid size={32} />
            <p className="text-lg">Browse</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/profile">
          <div className="flex items-center gap-4">
            <User size={32} />
            <p className="text-lg">Profile</p>
          </div>
        </Link>
      </Button>
    </div>
  );
}
