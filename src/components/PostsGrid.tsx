import { Post } from "@prisma/client";
import Masonry from "react-masonry-css";
import Image from "next/image";

export default function PostsGrid({ posts }: { posts: Post[] }) {
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
          <div className="mb-4">
            <img src={post.image} alt="Post" />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
