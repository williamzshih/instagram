import { SettingsIcon } from "lucide-react";
import Settings from "@/components/Settings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  currentUser?: boolean;
  user: {
    bio: string;
    createdAt: Date;
    email?: null | string;
    id?: string;
    image?: null | string;
    name?: null | string;
    username: string;
  };
};

export default function ProfileHeader({ currentUser, user }: Props) {
  return (
    <div className="flex items-center justify-between w-full h-full">
      <Button className="invisible">
        <SettingsIcon className="size-8" />
      </Button>
      <p className="text-2xl font-semibold">@{user.username}</p>
      {currentUser ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="size-fit cursor-pointer" variant="ghost">
              <SettingsIcon className="size-8" />
            </Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle className="text-xl">Settings</DialogTitle>
            <Settings user={user} />
          </DialogContent>
        </Dialog>
      ) : (
        <Button className="invisible">
          <SettingsIcon className="size-8" />
        </Button>
      )}
    </div>
  );
}
