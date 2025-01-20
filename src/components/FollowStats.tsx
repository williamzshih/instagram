import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserHeader from "@/components/UserHeader";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function FollowStats({
  user,
}: {
  user: {
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
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-fit h-fit flex flex-col items-center justify-center"
          >
            <p className="text-lg font-bold">{user.followers.length}</p>
            <p>{user.followers.length === 1 ? "Follower" : "Followers"}</p>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Followers</DialogTitle>
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
          <Button
            variant="ghost"
            className="w-fit h-fit flex flex-col items-center justify-center"
          >
            <p className="text-lg font-bold">{user.following.length}</p>
            <p>Following</p>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Following</DialogTitle>
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
