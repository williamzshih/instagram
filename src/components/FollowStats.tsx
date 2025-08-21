import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserBlock from "@/components/UserBlock";

type Props = {
  currentUser?: boolean;
  user: {
    followers: {
      createdAt: Date;
      id: string;
      image: null | string;
      name: null | string;
      username: string;
    }[];
    following: {
      createdAt: Date;
      id: string;
      image: null | string;
      name: null | string;
      username: string;
    }[];
  };
};

export default function FollowStats({ currentUser, user }: Props) {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="size-fit flex flex-col gap-0 cursor-pointer"
            variant="ghost"
          >
            <p className="text-lg">{user.followers.length}</p>
            Follower{user.followers.length === 1 && "s"}
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle className="text-xl">Followers</DialogTitle>
          <ScrollArea className="sm:max-h-[85vh] pr-4">
            <div className="flex flex-col gap-4">
              {user.followers.length > 0 ? (
                user.followers.map((follower) => (
                  <div className="relative" key={follower.id}>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="bg-muted rounded-xl p-4 hover:brightness-95 transition-all">
                          <Link href={`/user/${follower.id}`}>
                            <UserBlock noLink size={10} user={follower} />
                          </Link>
                        </div>
                      </HoverCardTrigger>
                      {currentUser && (
                        <HoverCardContent className="w-fit">
                          Followed you on{" "}
                          {follower.createdAt.toLocaleDateString()}
                        </HoverCardContent>
                      )}
                    </HoverCard>
                    {currentUser && (
                      <Button
                        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-500"
                        variant="outline"
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No followers yet</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="size-fit flex flex-col gap-0 cursor-pointer"
            variant="ghost"
          >
            <p className="text-lg">{user.following.length}</p>
            Following
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle className="text-xl">Following</DialogTitle>
          <ScrollArea className="sm:max-h-[85vh] pr-4">
            <div className="flex flex-col gap-4">
              {user.following.length > 0 ? (
                user.following.map((followee) => (
                  <div className="relative" key={followee.id}>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="bg-muted rounded-xl p-4 hover:brightness-95 transition-all">
                          <Link href={`/user/${followee.id}`}>
                            <UserBlock noLink size={10} user={followee} />
                          </Link>
                        </div>
                      </HoverCardTrigger>
                      {currentUser && (
                        <HoverCardContent className="w-fit">
                          Followed you on{" "}
                          {followee.createdAt.toLocaleDateString()}
                        </HoverCardContent>
                      )}
                    </HoverCard>
                    {currentUser && (
                      <Button
                        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-500"
                        variant="outline"
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
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
