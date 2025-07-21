import Link from "next/link";
import Image from "next/image";
import Masonry from "react-masonry-css";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { type Post } from "@/actions/profile";

type PostGridProps = {
  posts: Post[];
  type: "posts" | "likes" | "bookmarks";
};

export default function PostGrid({ posts, type }: PostGridProps) {
  return (
    <Masonry
      breakpointCols={{
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
      }}
      className="flex -ml-4"
      columnClassName="pl-4"
    >
      {posts.map((post) => (
        <div key={post.id} className="mb-4">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link href={`/post/${post.id}`}>
                <Image
                  src={post.image}
                  alt={post.caption || "Post image"}
                  width={1920}
                  height={1080}
                  className="hover:opacity-75 transition-opacity"
                />
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="text-center w-auto">
              {type === "posts"
                ? "Posted"
                : type === "likes"
                ? "Liked"
                : "Bookmarked"}
              {" on "}
              {post.createdAt.toLocaleDateString()}
            </HoverCardContent>
          </HoverCard>
        </div>
      ))}
    </Masonry>
  );
}
