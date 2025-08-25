import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { getPosts } from "@/actions/user";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Post = Awaited<ReturnType<typeof getPosts>>[number];

type Props = {
  posts: Post[];
  type?: "bookmarks" | "likes" | "posts";
};

export default function PostGrid({ posts, type = "posts" }: Props) {
  return (
    <Masonry
      breakpointCols={{
        500: 1,
        700: 2,
        1100: 3,
        default: 4,
      }}
      className="-ml-4 flex w-full"
      columnClassName="pl-4"
    >
      {posts.map((post) => (
        <div className="mb-4" key={post.id}>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link href={`/post/${post.id}`}>
                <Image
                  alt="Post image"
                  className="transition-all hover:brightness-75"
                  height={1000}
                  priority
                  src={`${post.image}?img-width=1000&img-height=1000`}
                  width={1000}
                />
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-full max-w-md flex-col gap-2">
              {post.caption && <p className="line-clamp-3">{post.caption}</p>}
              <p className="text-muted-foreground text-sm">
                {type === "posts"
                  ? "Posted"
                  : type === "likes"
                    ? "Liked"
                    : "Bookmarked"}
                {" on "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
      ))}
    </Masonry>
  );
}
