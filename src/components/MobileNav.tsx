import { House, LayoutGrid, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
  return (
    <div className="border-muted shadow-muted-foreground/10 text-foreground fixed right-4 bottom-4 left-4 flex items-center justify-evenly rounded-full border p-2 shadow-md backdrop-blur-md lg:hidden">
      <Button
        className="transition-transform hover:scale-105 hover:bg-transparent"
        size="icon"
        variant="ghost"
      >
        <Link href="/">
          <House />
        </Link>
      </Button>
      <Button
        className="transition-transform hover:scale-105 hover:bg-transparent"
        size="icon"
        variant="ghost"
      >
        <Link href="/search">
          <Search />
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
          <LayoutGrid />
        </Link>
      </Button>
      <Button
        className="transition-transform hover:scale-105 hover:bg-transparent"
        size="icon"
        variant="ghost"
      >
        <Link href="/profile">
          <User />
        </Link>
      </Button>
    </div>
  );
}
