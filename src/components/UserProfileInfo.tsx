import { User as UserType, Follow as FollowType } from "@prisma/client";
import ProfileHeader from "./ProfileHeader";
import GradientAvatar from "./GradientAvatar";
import FollowStats from "./FollowStats";

export default function UserProfileInfo({
  user,
  isCurrentUser,
}: {
  user: UserType & { followers: FollowType[]; following: FollowType[] };
  isCurrentUser?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <ProfileHeader username={user.username} isCurrentUser={isCurrentUser} />
      <GradientAvatar user={user} size={40} />
      <p className="text-xl font-bold">{user.name}</p>
      <p className="text-lg">{user.bio}</p>
      <FollowStats user={user} />
    </div>
  );
}
