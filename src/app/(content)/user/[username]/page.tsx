import { notFound, redirect } from "next/navigation";
import { getInitialFollow, getUser } from "@/actions/user";
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

  const initialFollow = await getInitialFollow({
    followeeId: user.id,
    followerId: session.user.id,
  });

  return (
    <ProfilePage
      currentUserId={session.user.id}
      initialFollow={initialFollow}
      type="user"
      user={user}
    />
  );
}
