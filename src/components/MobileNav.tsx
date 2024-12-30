import { Button } from "@/components/ui/button";
import Link from "next/link";
import { House, Search, Plus, LayoutGrid, User } from "lucide-react";

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center md:hidden">
      <div className="w-full p-2 flex items-center justify-evenly rounded-t-lg bg-background">
        <Button variant="ghost" size="icon">
          <Link href="/">
            <House />
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <Link href="/search">
            <Search />
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-center relative w-[186px]">
        <div className="p-2 border-[56px] rounded-full border-background border-t-transparent border-l-transparent rotate-45 absolute -top-[116px]">
          <div className="border-4 border-transparent -rotate-45">
            <Link
              href="/create"
              className="bg-gradient-to-tr from-ig-orange to-ig-red rounded-full text-white size-14 flex items-center justify-center"
            >
              <Plus />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full p-2 flex items-center justify-evenly rounded-t-lg bg-background">
        <Button variant="ghost" size="icon">
          <Link href="/browse">
            <LayoutGrid />
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <Link href="/profile">
            <User />
          </Link>
        </Button>
      </div>
    </div>
  );
}
