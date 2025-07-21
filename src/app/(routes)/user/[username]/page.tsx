// TODO: import 'type'
import { getProfile, type Profile } from "@/actions/profile";
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
      profile={profile as Profile} // if profile was null, getProfile would have thrown an error
      isFollowingInitial={isFollowing}
    />
  );
}
