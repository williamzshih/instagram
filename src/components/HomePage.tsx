"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { getPosts } from "@/actions/post";
import { getFollowing } from "@/actions/profile";
import Gradient from "@/components/Gradient";
import LinkAvatar from "@/components/LinkAvatar";
import Loading from "@/components/Loading";
import Post from "@/components/Post";

type Props = {
  profile: {
    _count: {
      followers: number;
      following: number;
    };
    avatar: string;
    bio: string;
    createdAt: Date;
    id: string;
    name: string;
    username: string;
  };
};

export default function HomePage({ profile }: Props) {
  const {
    data: following,
    error: followingError,
    isPending: followingPending,
  } = useQuery({
    queryFn: () => getFollowing(profile.id),
    queryKey: ["following", profile.id],
  });

  const {
    data: posts,
    error: postsError,
    isPending: postsPending,
  } = useQuery({
    queryFn: () => getPosts(profile.id),
    queryKey: ["posts", profile.id],
  });

  if (followingError) {
    console.error("Error getting followed users:", followingError);
    throw new Error("Error getting followed users:", { cause: followingError });
  }
  if (postsError) {
    console.error("Error getting posts:", postsError);
    throw new Error("Error getting posts:", { cause: postsError });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-full border flex items-center justify-center">
          <Plus />
        </div>
        {followingPending ? (
          <div className="flex items-center justify-center w-full">
            <Loading />
          </div>
        ) : (
          following.map((followee) => (
            <div
              className="flex flex-col items-center justify-center gap-1"
              key={followee.id}
            >
              <Gradient>
                <LinkAvatar profile={followee} size={16} />
              </Gradient>
              <p className="text-xs text-muted-foreground w-20 overflow-hidden text-ellipsis">
                @{followee.username}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col gap-12">
        {postsPending ? (
          <div className="flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          posts.map((post) => (
            <Post
              bookmarked={post.bookmarks?.some(
                (bookmark) => bookmark.user.id === profile.id
              )}
              fromHome
              key={post.id}
              liked={post.likes?.some((like) => like.user.id === profile.id)}
              likes={post._count?.likes ?? 0}
              postId={post.id}
              profile={profile}
            />
          ))
        )}
      </div>
    </div>
  );
}
