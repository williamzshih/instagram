import { notFound, redirect } from "next/navigation";
import { getInitialBookmarked, getInitialLiked, getPost } from "@/actions/post";
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

  const initialLiked = await getInitialLiked({
    postId: post.id,
    realUserId: session.user.id,
  });

  const initialBookmarked = await getInitialBookmarked({
    postId: post.id,
    realUserId: session.user.id,
  });

  return (
    <Post
      initialBookmarked={initialBookmarked}
      initialLiked={initialLiked}
      post={post}
    />
  );
}
