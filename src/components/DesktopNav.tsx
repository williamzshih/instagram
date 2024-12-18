import { House, Search, Plus, LayoutGrid, User } from "lucide-react";
import { Button } from "./ui/button";
import igLogo from "@/img/igLogo.svg";
import igText from "@/img/igText.svg";
import Image from "next/image";
import Link from "next/link";

export default function DesktopNav() {
  return (
    <div className="hidden md:flex flex-col gap-4 p-4 w-64 h-screen sticky top-0 shadow-md shadow-gray-500">
      <Button variant="ghost" className="w-fit p-2">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src={igLogo} alt="Instagram Logo" width={30} height={30} />
            <Image
              src={igText}
              alt="Instagram Text"
              width={100}
              height={100}
              className="mt-1"
            />
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit p-2">
        <Link href="/">
          <div className="flex items-center gap-4">
            <House size={30} absoluteStrokeWidth />
            <p className="text-[16px]">Home</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit p-2">
        <Link href="/search">
          <div className="flex items-center gap-4">
            <Search size={30} absoluteStrokeWidth />
            <p className="text-[16px]">Search</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit p-2">
        <Link href="/create">
          <div className="flex items-center gap-4">
            <Plus size={30} absoluteStrokeWidth />
            <p className="text-[16px]">Create</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit p-2">
        <Link href="/browse">
          <div className="flex items-center gap-4">
            <LayoutGrid size={30} absoluteStrokeWidth />
            <p className="text-[16px]">Browse</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit p-2">
        <Link href="/profile">
          <div className="flex items-center gap-4">
            <User size={30} absoluteStrokeWidth />
            <p className="text-[16px]">Profile</p>
          </div>
        </Link>
      </Button>
    </div>
  );
}
