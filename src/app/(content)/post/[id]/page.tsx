import { notFound, redirect } from "next/navigation";
import { getInitialBookmark, getInitialLike, getPost } from "@/actions/post";
import { auth } from "@/auth";
import Post from "@/components/Post";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const post = await getPost(id);
  if (!post) return notFound();

  const initialBookmark = await getInitialBookmark({
    postId: post.id,
    userId: session.user.id,
  });

  const initialLike = await getInitialLike({
    postId: post.id,
    userId: session.user.id,
  });

  return (
    <Post
      initialBookmark={initialBookmark}
      initialLike={initialLike}
      post={post}
    />
  );
}
