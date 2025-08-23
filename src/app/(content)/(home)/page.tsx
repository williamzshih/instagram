import { redirect } from "next/navigation";
import {
  getFollowingPosts,
  getInitialBookmark,
  getInitialLike,
} from "@/actions/post";
import { auth } from "@/auth";
import HomePage from "@/components/HomePage";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;
  const posts = await getFollowingPosts(userId);

  const transformedPosts = await Promise.all(
    posts.map(async (post) => ({
      initialBookmark: await getInitialBookmark({
        postId: post.id,
        userId,
      }),
      initialLike: await getInitialLike({
        postId: post.id,
        userId,
      }),
      post,
    }))
  );

  return <HomePage posts={transformedPosts} />;
}
