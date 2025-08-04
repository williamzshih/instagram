import FollowStats from "@/components/FollowStats";
import Gradient from "@/components/Gradient";
import LinkAvatar from "@/components/LinkAvatar";
import ProfileHeader from "@/components/ProfileHeader";

type Props = {
  currentUser?: boolean;
  following?: boolean;
  profile: {
    _count: {
      followers: number;
      following: number;
    };
    avatar: string;
    bio: string;
    createdAt: Date;
    id: string;
    name: string;
    username: string;
  };
};

export default function ProfileInfo({
  currentUser,
  following,
  profile,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <ProfileHeader currentUser={currentUser} profile={profile} />
      <Gradient>
        <LinkAvatar noLink profile={profile} size={40} />
      </Gradient>
      <p className="text-xl font-bold">{profile.name}</p>
      {profile.bio && <p className="text-lg max-w-md">{profile.bio}</p>}
      <FollowStats
        currentUser={currentUser}
        following={following}
        profile={profile}
      />
    </div>
  );
}
