import ProfileHeader from "@/components/ProfileHeader";
import FollowStats from "@/components/FollowStats";
import Gradient from "@/components/Gradient";
import LinkAvatar from "@/components/LinkAvatar";
import { type Profile } from "@/actions/profile";

export default function ProfileInfo({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <ProfileHeader profile={profile} />
      <Gradient>
        <LinkAvatar user={profile} size={40} />
      </Gradient>
      <p className="text-xl font-bold">{profile.name}</p>
      {profile.bio && <p className="text-lg">{profile.bio}</p>}
      <FollowStats profile={profile} />
    </div>
  );
}
