import { User as UserType, Post as PostType } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import Masonry from "react-masonry-css";
import Comment from "@/components/Comment";
import Link from "next/link";
import Image from "next/image";
import UserHeader from "@/components/UserHeader";

export default function SearchResults({
  users,
  posts,
  q,
}: {
  users: UserType[];
  posts: (PostType & { user: UserType })[];
  q: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">Search results for: {q}</p>
      <Separator />
      <p className="text-xl font-bold">Users</p>
      {users.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/user/${user.username}`}
              className="bg-muted rounded-lg px-4 py-2"
            >
              <UserHeader user={user} size={16} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No users found</p>
      )}
      <Separator />
      <p className="text-xl font-bold">Posts</p>
      {posts.length > 0 ? (
        <Masonry
          breakpointCols={3}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="bg-muted rounded-lg p-4 flex flex-col justify-center gap-2 mb-4"
            >
              <Image
                src={post.image}
                alt="Post image"
                width={1920}
                height={1080}
              />
              <Separator />
              <Comment
                user={post.user}
                comment={post.caption}
                createdAt={post.createdAt}
                size={12}
              />
            </Link>
          ))}
        </Masonry>
      ) : (
        <p className="text-sm text-muted-foreground">No posts found</p>
      )}
    </div>
  );
}
