import { House } from "lucide-react";
import localFont from "next/font/local";
import { getFollowingPosts } from "@/actions/post";
import PostPage from "@/components/PostPage";
import { Separator } from "@/components/ui/separator";

const googleSans = localFont({
  src: "../app/fonts/GoogleSansCodeVF.ttf",
});

type Post = Awaited<ReturnType<typeof getFollowingPosts>>[number];

type Props = {
  posts: {
    initialBookmark: boolean;
    initialLike: boolean;
    post: Post;
  }[];
};

export default function HomePage({ posts }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 lg:ml-6">
        <House className="size-8" />
        <p className={`text-2xl font-semibold ${googleSans.className}`}>Home</p>
      </div>
      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <div className="flex flex-col gap-8" key={post.post.id}>
            <PostPage home {...post} />
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
}
