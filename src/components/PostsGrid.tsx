import { Post as PostType } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export default function PostsGrid({ posts }: { posts: PostType[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {posts.map((post) => (
        <Link href={`/post/${post.id}`} key={post.id}>
          <Image
            src={post.image}
            alt="Post image"
            className="rounded-lg"
            width={384}
            height={384}
          />
        </Link>
      ))}
    </div>
  );
}
