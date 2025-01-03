import { Button } from "@/components/ui/button";
import { User as UserType, Follow as FollowType } from "@prisma/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UserHeader from "@/components/UserHeader";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function FollowStats({
  user,
}: {
  user: UserType & {
    followers: (FollowType & { user: UserType })[];
    following: (FollowType & { following: UserType })[];
  };
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-fit h-fit">
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-bold">{user.followers.length}</p>
              <p>{user.followers.length === 1 ? "Follower" : "Followers"}</p>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <p className="text-2xl font-bold">Followers</p>
          <Separator />
          <ScrollArea className="h-[75vh] pr-4">
            <div className="flex flex-col gap-4">
              {user.followers.length > 0 ? (
                user.followers.map((follow) => (
                  <Link
                    key={follow.id}
                    href={`/user/${follow.user.username}`}
                    className="bg-muted rounded-lg px-4 py-2"
                  >
                    <UserHeader user={follow.user} size={16} />
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No followers yet
                </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-fit h-fit">
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-bold">{user.following.length}</p>
              <p>Following</p>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <p className="text-2xl font-bold">Following</p>
          <Separator />
          <ScrollArea className="h-[75vh] pr-4">
            <div className="flex flex-col gap-4">
              {user.following.length > 0 ? (
                user.following.map((follow) => (
                  <Link
                    key={follow.id}
                    href={`/user/${follow.following.username}`}
                    className="bg-muted rounded-lg px-4 py-2"
                  >
                    <UserHeader user={follow.following} size={16} />
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not following anyone yet
                </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
