import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User as UserType, Follow as FollowType } from "@prisma/client";

export default function FollowStats({
  user,
}: {
  user: UserType & { followers: FollowType[]; following: FollowType[] };
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="ghost" className="w-fit h-fit">
        <Link href={`/user/${user.username}/followers`}>
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-bold">{user.followers.length}</p>
            <p>{user.followers.length === 1 ? "Follower" : "Followers"}</p>
          </div>
        </Link>
      </Button>
      <Button variant="ghost" className="w-fit h-fit">
        <Link href={`/user/${user.username}/following`}>
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-bold">{user.following.length}</p>
            <p>Following</p>
          </div>
        </Link>
      </Button>
    </div>
  );
}
