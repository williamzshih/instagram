import { House, LayoutGrid, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center md:hidden">
      <div className="w-full p-2 flex items-center justify-evenly rounded-t-lg bg-background">
        <Button size="icon" variant="ghost">
          <Link href="/">
            <House />
          </Link>
        </Button>
        <Button size="icon" variant="ghost">
          <Link href="/search">
            <Search />
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-center relative w-[186px]">
        <div className="p-2 border-[56px] rounded-full border-background border-t-transparent border-l-transparent rotate-45 absolute -top-[116px]">
          <div className="border-4 border-transparent -rotate-45">
            <Link
              className="bg-linear-to-tr from-ig-orange to-ig-red rounded-full text-white size-14 flex items-center justify-center"
              href="/create"
            >
              <Plus />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full p-2 flex items-center justify-evenly rounded-t-lg bg-background">
        <Button size="icon" variant="ghost">
          <Link href="/browse">
            <LayoutGrid />
          </Link>
        </Button>
        <Button size="icon" variant="ghost">
          <Link href="/profile">
            <User />
          </Link>
        </Button>
      </div>
    </div>
  );
}
