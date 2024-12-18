"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings, BadgeCheck } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import PostsGrid from "@/components/PostsGrid";
import Link from "next/link";
import { getPosts, getUser } from "@/utils/actions";
import {
  Post as PostType,
  User as UserType,
  Comment as CommentType,
} from "@prisma/client";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("posts");
  const [user, setUser] = useState<
    (UserType & { posts: PostType[]; comments: CommentType[] }) | null
  >(null);
  const [posts, setPosts] = useState<
    (PostType & { user: UserType; comments: CommentType[] })[]
  >([]);

  useEffect(() => {
    const fetchUser = async () => setUser(await getUser());
    const fetchPosts = async () => setPosts(await getPosts());
    fetchUser();
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-between w-full mb-4">
        <Button size="icon" variant="ghost">
          <ChevronLeft />
        </Button>
        <div className="flex items-center justify-center gap-2">
          <p className="text-2xl font-bold">{user?.username || ""}</p>
          <BadgeCheck />
        </div>
        <Button size="icon" variant="ghost">
          <Link href="/settings">
            <Settings />
          </Link>
        </Button>
      </div>
      <div className="p-1 rounded-full flex items-center justify-center bg-gradient-to-tr from-ig-orange to-ig-red mb-4">
        <div className="p-1 bg-white rounded-full">
          <Avatar className="w-40 h-40 rounded-full">
            <AvatarImage
              src={
                user?.avatar ||
                "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
              }
              alt="Avatar"
              className="w-40 h-40 rounded-full object-cover"
            />
          </Avatar>
        </div>
      </div>
      <p className="text-xl font-bold">{user?.name || ""}</p>
      <p className="text-lg mb-4">{user?.bio || ""}</p>
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
      {selectedTab === "posts" && <PostsGrid posts={posts} />}
    </div>
  );
}
