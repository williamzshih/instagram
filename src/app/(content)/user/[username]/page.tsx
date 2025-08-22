import { notFound, redirect } from "next/navigation";
import { getInitialFollowing, getUser } from "@/actions/user";
import { auth } from "@/auth";
import ProfilePage from "@/components/ProfilePage";

export default async function User({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await getUser(username);
  if (!user) return notFound();

  const transformedUser = {
    ...user,
    bookmarks: user.bookmarks.map((bookmark) => ({
      ...bookmark.post,
      createdAt: bookmark.createdAt,
    })),
    followers: user.followers.map((follow) => ({
      ...follow.realFollower,
      createdAt: follow.createdAt,
    })),
    following: user.following.map((follow) => ({
      ...follow.realFollowee,
      createdAt: follow.createdAt,
    })),
    likes: user.likes.map((like) => ({
      ...like.post,
      createdAt: like.createdAt,
    })),
  };

  const initialFollowing = await getInitialFollowing({
    realFolloweeId: user.id,
    realFollowerId: session.user.id,
  });

  return (
    <ProfilePage
      currentUserId={session.user.id}
      initialFollowing={initialFollowing}
      user={transformedUser}
    />
  );
}
