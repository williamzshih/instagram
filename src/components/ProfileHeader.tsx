import { SettingsIcon } from "lucide-react";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className="flex h-full w-full items-center justify-between">
      <Button className="invisible">
        <SettingsIcon className="size-8" />
      </Button>
      <p className="text-2xl font-semibold">@{user.username}</p>
      {currentUser ? (
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button className="size-fit cursor-pointer" variant="ghost">
              <SettingsIcon className="size-8" />
            </Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle className="text-xl">Settings</DialogTitle>
            <Settings
              close={() => {
                wait().then(() => setOpen(false));
              }}
              user={user}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Button className="invisible size-fit">
          <SettingsIcon className="size-8" />
        </Button>
      )}
    </div>
  );
}
