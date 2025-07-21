import ProfileHeader from "@/components/ProfileHeader";
import FollowStats from "@/components/FollowStats";
import Gradient from "@/components/Gradient";
import LinkAvatar from "@/components/LinkAvatar";
import { type ProfilePageProps } from "@/components/ProfilePage";

export default function ProfileInfo({
  profile,
  isCurrentUser,
}: ProfilePageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <ProfileHeader profile={profile} isCurrentUser={isCurrentUser} />
      <Gradient>
        <LinkAvatar user={profile} size={40} isProfilePage />
      </Gradient>
      <p className="text-xl font-bold">{profile.name}</p>
      {profile.bio && <p className="text-lg max-w-md">{profile.bio}</p>}
      <FollowStats profile={profile} isCurrentUser={isCurrentUser} />
    </div>
  );
}
