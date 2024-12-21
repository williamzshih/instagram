"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/utils/actions";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import ProfilePicture from "@/components/ProfilePicture";
import Post from "./post/[id]/page";

export default function Home() {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching user", error);
    toast.error("Error fetching user");
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        <p>Error fetching user</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex gap-4 self-start">
        <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center">
          <Plus size={30} />
        </div>
        {user.following.map((user) => (
          <div
            key={user.whoTheyreFollowing.id}
            className="flex flex-col items-center justify-center gap-1"
          >
            <div className="w-24 h-24">
              <ProfilePicture user={user.whoTheyreFollowing} size={20} />
            </div>
            <p className="text-sm text-gray-500">
              {user.whoTheyreFollowing.username}
            </p>
          </div>
        ))}
      </div>
      {user.following
        .flatMap((user) => user.whoTheyreFollowing.posts)
        .map((post) => (
          <Post key={post.id} params={{ id: post.id }} fromHome />
        ))}
    </div>
  );
}
