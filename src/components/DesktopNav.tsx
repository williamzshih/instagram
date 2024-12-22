import { House, Search, Plus, LayoutGrid, User } from "lucide-react";
import { Button } from "./ui/button";
import igLogo from "@/img/igLogo.svg";
import igText from "@/img/igText.svg";
import Image from "next/image";
import Link from "next/link";

export default function DesktopNav() {
  return (
    <div className="hidden md:flex flex-col gap-4 p-4 h-screen sticky top-0 shadow-md shadow-gray-500">
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src={igLogo} alt="Instagram logo" width={30} height={30} />
            <Image
              src={igText}
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
            <House size={30} absoluteStrokeWidth />
            <p className="text-lg">Home</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/search">
          <div className="flex items-center gap-4">
            <Search size={30} absoluteStrokeWidth />
            <p className="text-lg">Search</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/create">
          <div className="flex items-center gap-4">
            <Plus size={30} absoluteStrokeWidth />
            <p className="text-lg">Create</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/browse">
          <div className="flex items-center gap-4">
            <LayoutGrid size={30} absoluteStrokeWidth />
            <p className="text-lg">Browse</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit h-fit">
        <Link href="/profile">
          <div className="flex items-center gap-4">
            <User size={30} absoluteStrokeWidth />
            <p className="text-lg">Profile</p>
          </div>
        </Link>
      </Button>
    </div>
  );
}
