import { redirect } from "next/navigation";
import { getPostInitial } from "@/actions/post";
import { getProfile } from "@/actions/profile";
import { auth } from "@/auth";
import Post from "@/components/Post";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/sign-in");
  const profile = await getProfile({ email: session.user.email });
  const post = await getPostInitial(id);

  if (!post) redirect("/");

  return (
    <Post
      bookmarked={post.bookmarks.some(
        (bookmark) => bookmark.user.id === profile.id
      )}
      liked={post.likes.some((like) => like.user.id === profile.id)}
      likes={post._count.likes}
      postId={id}
      profile={profile}
    />
  );
}
