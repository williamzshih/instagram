import { House, LayoutGrid, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
  return (
    <div className="fixed bottom-4 left-4 right-4 lg:hidden p-2 flex items-center justify-evenly rounded-full border border-muted backdrop-blur-md shadow-md shadow-muted-foreground/10 text-foreground">
      <Button
        className="hover:bg-transparent hover:scale-105 transition-transform"
        size="icon"
        variant="ghost"
      >
        <Link href="/">
          <House />
        </Link>
      </Button>
      <Button
        className="hover:bg-transparent hover:scale-105 transition-transform"
        size="icon"
        variant="ghost"
      >
        <Link href="/search">
          <Search />
        </Link>
      </Button>
      <Link
        className="bg-gradient-to-r from-ig-orange to-ig-red rounded-full text-white size-12 flex items-center justify-center hover:scale-105 transition-transform"
        href="/create"
      >
        <Plus />
      </Link>
      <Button
        className="hover:bg-transparent hover:scale-105 transition-transform"
        size="icon"
        variant="ghost"
      >
        <Link href="/browse">
          <LayoutGrid />
        </Link>
      </Button>
      <Button
        className="hover:bg-transparent hover:scale-105 transition-transform"
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
