import { Post as PostType } from "@prisma/client";
import Masonry from "react-masonry-css";
import Link from "next/link";

export default function PostsGrid({ posts }: { posts: PostType[] }) {
  return (
    <div className="w-11/12 mx-auto">
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
          <Link href={`/post/${post.id}`} className="mb-4">
            <img
              src={post.image}
              alt="Post"
              className="rounded-lg object-cover"
            />
          </Link>
        ))}
      </Masonry>
    </div>
  );
}
