import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Props = {
  posts: {
    createdAt: Date;
    id: string;
    image: string;
  }[];
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
      className="flex -ml-4 w-full"
      columnClassName="pl-4"
    >
      {posts.map((post) => (
        <div className="mb-4" key={post.id}>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link href={`/post/${post.id}`}>
                <Image
                  alt="Image of the post"
                  className="hover:brightness-75 transition-all"
                  height={500}
                  src={`${post.image}?img-width=500&img-height=500`}
                  width={500}
                />
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
              {type === "posts"
                ? "Posted"
                : type === "likes"
                  ? "Liked"
                  : "Bookmarked"}
              {" on "}
              {new Date(post.createdAt).toLocaleDateString()}
            </HoverCardContent>
          </HoverCard>
        </div>
      ))}
    </Masonry>
  );
}
