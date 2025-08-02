import ProfileHeader from "@/components/ProfileHeader";
import FollowStats from "@/components/FollowStats";
import Gradient from "@/components/Gradient";
import LinkAvatar from "@/components/LinkAvatar";

type Props = {
  profile: {
    id: string;
    username: string;
    name: string;
    bio: string;
    avatar: string;
    createdAt: Date;
    _count: {
      followers: number;
      following: number;
    };
  };
  isCurrentUser?: boolean;
};

export default function ProfileInfo({ profile, isCurrentUser }: Props) {
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
