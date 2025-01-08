import Link from "next/link";
import Image from "next/image";
import Masonry from "react-masonry-css";

export default function PostsGrid({
  posts,
}: {
  posts: {
    id: string;
    image: string;
  }[];
}) {
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
