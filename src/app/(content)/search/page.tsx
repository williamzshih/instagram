"use client";

import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, SearchIcon } from "lucide-react";
import localFont from "next/font/local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { searchPosts } from "@/actions/post";
import { searchUsers } from "@/actions/user";
import PostGrid from "@/components/PostGrid";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserBlock from "@/components/UserBlock";

const googleSans = localFont({
  src: "../../fonts/GoogleSansCodeVF.ttf",
});

export default function Search() {
  const [view, setView] = useState("users");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: users,
    error: usersError,
    isPending: usersPending,
  } = useQuery({
    enabled: !!debouncedSearch && view === "users",
    queryFn: () => searchUsers(debouncedSearch),
    queryKey: ["users", debouncedSearch],
  });

  const {
    data: posts,
    error: postsError,
    isPending: postsPending,
  } = useQuery({
    enabled: !!debouncedSearch && view === "posts",
    queryFn: () => searchPosts(debouncedSearch),
    queryKey: ["posts", debouncedSearch],
  });

  if (usersError) {
    console.error("Error searching users:", usersError);
    throw new Error("Error searching users:", { cause: usersError });
  }

  if (postsError) {
    console.error("Error searching posts:", postsError);
    throw new Error("Error searching posts:", { cause: postsError });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 lg:ml-6">
        <SearchIcon className="size-8" />
        <p className={`text-2xl font-semibold ${googleSans.className}`}>
          Search
        </p>
      </div>
      <Input
        className="lg:ml-6"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        value={search}
      />
      {debouncedSearch && (
        <Tabs
          className="gap-4 lg:ml-6"
          defaultValue="users"
          onValueChange={setView}
        >
          <TabsList className="w-full">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            {usersPending ? (
              <div className="mt-16 flex justify-center">
                <LoaderCircle className="animate-spin" size={48} />
              </div>
            ) : users.length > 0 ? (
              <div className="flex flex-col gap-4">
                <p className="text-muted-foreground">
                  Search results for: {debouncedSearch}
                </p>
                <Separator />
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {users.map((user) => (
                    <Link
                      className="bg-muted rounded-xl p-4 transition-all hover:brightness-95"
                      href={`/user/${user.username}`}
                      key={user.id}
                    >
                      <UserBlock size={12} user={user} />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground flex justify-center">
                No users found
              </p>
            )}
          </TabsContent>
          <TabsContent value="posts">
            {postsPending ? (
              <div className="mt-16 flex justify-center">
                <LoaderCircle className="animate-spin" size={48} />
              </div>
            ) : posts.length > 0 ? (
              <div className="flex flex-col gap-4">
                <p className="text-muted-foreground">
                  Search results for: {debouncedSearch}
                </p>
                <Separator />
                <div className="lg:-ml-6">
                  <PostGrid posts={posts} />
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground flex justify-center">
                No posts found
              </p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
