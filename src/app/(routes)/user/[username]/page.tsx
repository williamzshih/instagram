import { checkFollow, getProfile } from "@/actions/profile";
import ProfilePage from "@/components/ProfilePage";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfile({ username });
  const following = await checkFollow(profile.id);

  return <ProfilePage following={following} profile={profile} />;
}
