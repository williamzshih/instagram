"use client";

import { House, LayoutGrid, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMousePosition } from "@/hooks/useMousePosition";

export default function MobileNav() {
  const mousePosition = useMousePosition();
  const [relativePosition, setRelativePosition] = useState({
    x: "50%",
    y: "50%",
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = ((mousePosition.x - rect.left) / rect.width) * 100;
    const y = ((mousePosition.y - rect.top) / rect.height) * 100;

    if (x < -100 || y < -100 || x > 200 || y > 200) return;

    setRelativePosition({
      x: `${x}%`,
      y: `${y}%`,
    });
  }, [mousePosition.x, mousePosition.y]);

  return (
    <div
      className="glass-hover border-muted shadow-muted-foreground/10 text-foreground fixed right-4 bottom-4 left-4 flex items-center justify-evenly rounded-full border p-2 shadow-md backdrop-blur-md transition-transform hover:scale-101 lg:hidden"
      ref={ref}
      style={
        {
          "--relative-x": relativePosition.x,
          "--relative-y": relativePosition.y,
        } as React.CSSProperties
      }
    >
      <Button
        className="transition-transform hover:scale-105 hover:bg-transparent"
        size="icon"
        variant="ghost"
      >
        <Link href="/">
          <House className="size-8" />
        </Link>
      </Button>
      <Button
        className="transition-transform hover:scale-105 hover:bg-transparent"
        size="icon"
        variant="ghost"
      >
        <Link href="/search">
          <Search className="size-8" />
        </Link>
      </Button>
      <Link
        className="from-ig-orange to-ig-red flex size-12 items-center justify-center rounded-full bg-gradient-to-r text-white transition-transform hover:scale-105"
        href="/create"
      >
        <Plus />
      </Link>
      <Button
        className="transition-transform hover:scale-105 hover:bg-transparent"
        size="icon"
        variant="ghost"
      >
        <Link href="/browse">
          <LayoutGrid className="size-8" />
        </Link>
      </Button>
      <Button
        className="transition-transform hover:scale-105 hover:bg-transparent"
        size="icon"
        variant="ghost"
      >
        <Link href="/profile">
          <User className="size-8" />
        </Link>
      </Button>
    </div>
  );
}
