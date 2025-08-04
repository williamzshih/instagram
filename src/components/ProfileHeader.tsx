import { SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
  profile: {
    avatar: string;
    bio: string;
    createdAt: Date;
    id: string;
    name: string;
    username: string;
  };
};

export default function ProfileHeader({ currentUser, profile }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between w-full">
      <Button className="invisible" size="icon" />
      <p className="text-2xl font-bold">@{profile.username}</p>
      {currentUser ? (
        <Dialog onOpenChange={(open) => !open && router.refresh()}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <SettingsIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-4">
            <DialogTitle className="text-xl">Settings</DialogTitle>
            <Settings profile={profile} />
          </DialogContent>
        </Dialog>
      ) : (
        <Button className="invisible" size="icon" />
      )}
    </div>
  );
}
