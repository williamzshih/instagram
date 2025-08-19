import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { getImageHeight, getImageWidth } from "@/actions/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Props = {
  posts: {
    caption: string;
    createdAt: Date;
    id: string;
    image: string;
  }[];
  type: "bookmarks" | "likes" | "posts";
};

export default function PostGrid({ posts, type }: Props) {
  return (
    <Masonry
      breakpointCols={{
        500: 1,
        700: 2,
        1100: 3,
        default: 4,
      }}
      className="flex -ml-4"
      columnClassName="pl-4"
    >
      {posts.map((post) => (
        <div className="mb-4" key={post.id}>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link href={`/post/${post.id}`}>
                <Image
                  alt={post.caption || "Image of the post"}
                  className="hover:opacity-75 transition-opacity"
                  height={getImageHeight(post.image)}
                  src={post.image}
                  width={getImageWidth(post.image)}
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
