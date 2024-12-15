"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings, BadgeCheck } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import PostsGrid from "@/components/PostsGrid";
import Link from "next/link";
export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("posts");

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-between w-full mb-4">
        <Button size="icon" variant="ghost">
          <ChevronLeft />
        </Button>
        <div className="flex items-center justify-center gap-2">
          <p className="text-2xl font-bold">username123</p>
          <BadgeCheck />
        </div>
        <Button size="icon" variant="ghost">
          <Link href="/settings">
            <Settings />
          </Link>
        </Button>
      </div>
      <div className="p-1 rounded-full flex items-center justify-center bg-gradient-to-tr from-ig-orange to-ig-red mb-4">
        <div className="bg-white p-1 rounded-full">
          <Avatar className="w-40 h-40">
            <AvatarImage src="https://picsum.photos/200/300" />
          </Avatar>
        </div>
      </div>
      <p className="text-xl font-bold">Name</p>
      <p className="text-lg mb-4">Bio</p>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button
          variant={selectedTab === "posts" ? "default" : "ghost"}
          className="text-lg"
          onClick={() => setSelectedTab("posts")}
        >
          Posts
        </Button>
        <Button
          variant={selectedTab === "highlights" ? "default" : "ghost"}
          className="text-lg"
          onClick={() => setSelectedTab("highlights")}
        >
          Highlights
        </Button>
      </div>
      {selectedTab === "posts" && <PostsGrid />}
    </div>
  );
}
