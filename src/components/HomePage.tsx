import { DefaultError, InfiniteData, QueryKey } from "@tanstack/query-core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { House, LoaderCircle } from "lucide-react";
import localFont from "next/font/local";
import { useEffect, useRef } from "react";
import { getFollowingPosts } from "@/actions/post";
import PostPage from "@/components/PostPage";
import PostPageLoading from "@/components/PostPageLoading";
import { Separator } from "@/components/ui/separator";

const googleSans = localFont({
  src: "../app/fonts/GoogleSansCodeVF.ttf",
});

type Posts = Awaited<ReturnType<typeof getFollowingPosts>>;

export default function HomePage({ followerId }: { followerId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery<
    Posts,
    DefaultError,
    InfiniteData<Posts>,
    QueryKey,
    string | undefined
  >({
    getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.post.id,
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      getFollowingPosts({ followerId, id: pageParam }),
    queryKey: ["homePage"],
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) fetchNextPage();
    });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (error) {
    console.error("Error getting your followed users' posts:", error);
    throw new Error("Error getting your followed users' posts:", {
      cause: error,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 lg:ml-6">
        <House className="size-8" />
        <p className={`text-2xl font-semibold ${googleSans.className}`}>Home</p>
      </div>
      <div className="flex flex-col gap-8">
        {isPending ? (
          <PostPageLoading />
        ) : data.pages.flat().length > 0 ? (
          data.pages.flat().map((post) => (
            <div className="flex flex-col gap-8" key={post.post.id}>
              <PostPage home {...post} />
              <Separator />
            </div>
          ))
        ) : (
          <p className="text-muted-foreground flex justify-center">
            Follow more users to see their posts here!
          </p>
        )}
      </div>
      {isFetchingNextPage && (
        <div className="flex justify-center">
          <LoaderCircle className="animate-spin" size={48} />
        </div>
      )}
      {hasNextPage && <div ref={ref} />}
    </div>
  );
}
