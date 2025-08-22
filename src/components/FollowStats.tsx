import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { create } from "zustand";
import { toggleFollow } from "@/actions/user";
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

type FollowerStore = {
  deleteFollower: (followerId: string) => void;
  followers: FollowUser[];
  setFollowers: (followers: FollowUser[]) => void;
};

const useFollowerStore = create<FollowerStore>((set) => ({
  deleteFollower: (followerId) =>
    set((state) => ({
      followers: state.followers.filter(
        (follower) => follower.id !== followerId
      ),
    })),
  followers: [],
  setFollowers: (followers) => set({ followers }),
}));

type FolloweeStore = {
  deleteFollowee: (followeeId: string) => void;
  following: FollowUser[];
  setFollowing: (following: FollowUser[]) => void;
};

const useFolloweeStore = create<FolloweeStore>((set) => ({
  deleteFollowee: (followeeId) =>
    set((state) => ({
      following: state.following.filter(
        (followee) => followee.id !== followeeId
      ),
    })),
  following: [],
  setFollowing: (following) => set({ following }),
}));

type FollowUser = {
  createdAt: Date;
  id: string;
  image?: null | string;
  name?: null | string;
  username: string;
};

type Props = {
  currentUser?: boolean;
  currentUserId?: string;
  followers: number;
  user: {
    followers: FollowUser[];
    following: FollowUser[];
    id: string;
  };
};

export default function FollowStats({
  currentUser,
  currentUserId,
  followers: numFollowers,
  user,
}: Props) {
  const followers = useFollowerStore((state) => state.followers);
  const following = useFolloweeStore((state) => state.following);
  const deleteFollower = useFollowerStore((state) => state.deleteFollower);
  const deleteFollowee = useFolloweeStore((state) => state.deleteFollowee);
  const setFollowers = useFollowerStore((state) => state.setFollowers);
  const setFollowing = useFolloweeStore((state) => state.setFollowing);
  useEffect(() => setFollowers(user.followers), [user.followers, setFollowers]);
  useEffect(() => setFollowing(user.following), [user.following, setFollowing]);

  const handleRemoveFollower = async (followerId: string) => {
    try {
      if (currentUser) currentUserId = user.id;
      if (!currentUserId) return;
      deleteFollower(followerId);
      await toggleFollow({
        following: true,
        realFolloweeId: currentUserId,
        realFollowerId: followerId,
      });
      toast.success("Removed follower");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleUnfollow = async (followeeId: string) => {
    try {
      if (currentUser) currentUserId = user.id;
      if (!currentUserId) return;
      deleteFollowee(followeeId);
      await toggleFollow({
        following: true,
        realFolloweeId: followeeId,
        realFollowerId: currentUserId,
      });
      toast.success("Unfollowed user");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="flex size-fit cursor-pointer flex-col gap-0"
            variant="ghost"
          >
            <p className="text-lg">
              {currentUser ? followers.length : numFollowers}
            </p>
            Follower
            {currentUser
              ? followers.length === 1 && "s"
              : numFollowers === 1 && "s"}
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle className="text-xl">Followers</DialogTitle>
          <ScrollArea className="pr-4 sm:max-h-[85vh]">
            <div className="flex flex-col gap-4">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <div className="relative" key={follower.id}>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="bg-muted rounded-xl p-4 transition-all hover:brightness-95">
                          <Link href={`/user/${follower.username}`}>
                            <UserBlock size={12} user={follower} />
                          </Link>
                        </div>
                      </HoverCardTrigger>
                      {currentUser && (
                        <HoverCardContent className="w-fit">
                          Followed you on{" "}
                          {new Date(follower.createdAt).toLocaleDateString()}
                        </HoverCardContent>
                      )}
                    </HoverCard>
                    {currentUser && (
                      <Button
                        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-red-500 hover:text-red-500"
                        onClick={() => handleRemoveFollower(follower.id)}
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
            className="flex size-fit cursor-pointer flex-col gap-0"
            variant="ghost"
          >
            <p className="text-lg">{following.length}</p>
            Following
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle className="text-xl">Following</DialogTitle>
          <ScrollArea className="pr-4 sm:max-h-[85vh]">
            <div className="flex flex-col gap-4">
              {following.length > 0 ? (
                following.map((followee) => (
                  <div className="relative" key={followee.id}>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="bg-muted rounded-xl p-4 transition-all hover:brightness-95">
                          <Link href={`/user/${followee.username}`}>
                            <UserBlock size={12} user={followee} />
                          </Link>
                        </div>
                      </HoverCardTrigger>
                      {currentUser && (
                        <HoverCardContent className="w-fit">
                          Followed you on{" "}
                          {new Date(followee.createdAt).toLocaleDateString()}
                        </HoverCardContent>
                      )}
                    </HoverCard>
                    {currentUser && (
                      <Button
                        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-red-500 hover:text-red-500"
                        onClick={() => handleUnfollow(followee.id)}
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
