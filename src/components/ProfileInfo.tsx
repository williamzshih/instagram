import ProfileHeader from "@/components/ProfileHeader";
import GradientAvatar from "@/components/GradientAvatar";
import FollowStats from "@/components/FollowStats";

export default function ProfileInfo({
  user,
  isCurrentUser,
}: {
  user: {
    username: string;
    name: string;
    bio: string;
    avatar: string;
    followers: {
      id: string;
      user: {
        username: string;
        avatar: string;
        name: string;
      };
    }[];
    following: {
      id: string;
      following: {
        username: string;
        avatar: string;
        name: string;
      };
    }[];
  };
  isCurrentUser?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <ProfileHeader user={user} isCurrentUser={isCurrentUser} />
      <GradientAvatar user={user} size={40} />
      <p className="text-xl font-bold">{user.name}</p>
      <p className="text-lg">{user.bio}</p>
      <FollowStats user={user} />
    </div>
  );
}
