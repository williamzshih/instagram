"use client";

import { Plus, LoaderCircle } from "lucide-react";
import GradientAvatar from "@/components/GradientAvatar";
import Post from "@/components/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { getUserHome } from "@/actions/user";

export default function HomeFeed({
  initialData,
}: {
  initialData: {
    following: {
      id: string;
      following: {
        username: string;
        avatar: string;
        posts: {
          id: string;
        }[];
      };
    }[];
    id: string;
    avatar: string;
    username: string;
    name: string;
    hasMore: boolean;
  };
}) {
  const { ref, inView } = useInView();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["homeFeed"],
      queryFn: ({ pageParam }) => getUserHome(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPage?.hasMore ? lastPageParam + 1 : undefined,
      initialData: {
        pages: [initialData],
        pageParams: [1],
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const allPosts = data.pages.flatMap(
    (page) => page?.following?.flatMap((follow) => follow.following.posts) || []
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-full border flex items-center justify-center">
          <Plus size={20} />
        </div>
        {data.pages[0]?.following.map((follow) => (
          <div
            key={follow.id}
            className="flex flex-col items-center justify-center gap-1"
          >
            <GradientAvatar user={follow.following} size={16} />
            <p className="text-[12px] text-muted-foreground">
              @
              {follow.following.username.length > 9
                ? follow.following.username.slice(0, 9) + "..."
                : follow.following.username}
            </p>
          </div>
        )) || []}
      </div>
      <div className="flex flex-col gap-4">
        {allPosts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            searchParams={{ from: "homeFeed" }}
            user={data.pages[0]!}
          />
        ))}
        {hasNextPage && (
          <div ref={ref} className="flex justify-center p-4">
            {isFetchingNextPage && <LoaderCircle className="animate-spin" />}
          </div>
        )}
      </div>
    </div>
  );
}
