import { Post as PostType } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import Masonry from "react-masonry-css";

export default function PostsGrid({ posts }: { posts: PostType[] }) {
  return (
    <Masonry
      breakpointCols={3}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {posts.map((post) => (
        <div key={post.id} className="mb-4">
          <Link href={`/post/${post.id}`}>
            <Image
              src={post.image}
              alt="Post image"
              width={1920}
              height={1080}
            />
          </Link>
        </div>
      ))}
    </Masonry>
  );
}
