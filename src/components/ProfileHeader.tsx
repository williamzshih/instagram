import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SettingsIcon } from "lucide-react";
import Settings from "@/components/Settings";
import { useRouter } from "next/navigation";
import { type ProfilePageProps } from "@/components/ProfilePage";

export default function ProfileHeader({
  profile,
  isCurrentUser,
}: ProfilePageProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between w-full">
      <Button size="icon" className="invisible" />
      <p className="text-2xl font-bold">@{profile.username}</p>
      {isCurrentUser ? (
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
        <Button size="icon" className="invisible" />
      )}
    </div>
  );
}
