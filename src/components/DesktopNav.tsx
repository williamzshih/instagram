"use client";

import { House, LayoutGrid, Plus, Search, User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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
      <Button className="w-fit h-fit" variant="ghost">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              alt="Instagram logo"
              height={32}
              src={
                theme === "dark"
                  ? "/Instagram_Glyph_White.svg"
                  : "/Instagram_Glyph_Black.svg"
              }
              width={32}
            />
            <Image
              alt="Instagram text"
              className="mt-1"
              height={36}
              src={
                theme === "dark"
                  ? "/Instagram_logo_white.svg"
                  : "/Instagram_logo_black.svg"
              }
              width={100}
            />
          </div>
        </Link>
      </Button>
      <Button className="w-fit h-fit" variant="ghost">
        <Link href="/">
          <div className="flex items-center gap-4">
            <House size={32} />
            <p className="text-lg">Home</p>
          </div>
        </Link>
      </Button>
      <Button className="w-fit h-fit" variant="ghost">
        <Link href="/search">
          <div className="flex items-center gap-4">
            <Search size={32} />
            <p className="text-lg">Search</p>
          </div>
        </Link>
      </Button>
      <Button className="w-fit h-fit" variant="ghost">
        <Link href="/create">
          <div className="flex items-center gap-4">
            <Plus size={32} />
            <p className="text-lg">Create</p>
          </div>
        </Link>
      </Button>
      <Button className="w-fit h-fit" variant="ghost">
        <Link href="/browse">
          <div className="flex items-center gap-4">
            <LayoutGrid size={32} />
            <p className="text-lg">Browse</p>
          </div>
        </Link>
      </Button>
      <Button className="w-fit h-fit" variant="ghost">
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
