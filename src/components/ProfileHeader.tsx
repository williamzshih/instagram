import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SettingsIcon } from "lucide-react";
import Settings from "@/components/Settings";
import { User as UserType } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function ProfileHeader({
  user,
  isCurrentUser,
}: {
  user: UserType;
  isCurrentUser?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between w-full">
      <Button size="icon" className="invisible" />
      <p className="text-2xl font-bold">{user.username}</p>
      {isCurrentUser ? (
        <Dialog
          onOpenChange={(open) => {
            if (!open) {
              router.refresh();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <SettingsIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Settings user={user} />
          </DialogContent>
        </Dialog>
      ) : (
        <Button size="icon" className="invisible" />
      )}
    </div>
  );
}
