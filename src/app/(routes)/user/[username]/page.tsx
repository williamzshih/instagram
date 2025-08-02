// TODO: import 'type'
import { getProfile } from "@/actions/profile";
import ProfilePage from "@/components/ProfilePage";

export default async function OtherProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { profile, isFollowing } = await getProfile(username);

  return (
    <ProfilePage
      profile={profile!} // if profile was null, getProfile would have thrown an error
      isFollowingInitial={isFollowing}
    />
  );
}
