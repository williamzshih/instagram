import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function ProfileHeader({
  username,
  isCurrentUser,
}: {
  username: string;
  isCurrentUser?: boolean;
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <Button size="icon" className="invisible" />
      <p className="text-2xl font-bold">{username}</p>
      {isCurrentUser ? (
        <Button size="icon" variant="ghost">
          <Link href="/settings">
            <Settings />
          </Link>
        </Button>
      ) : (
        <Button size="icon" className="invisible" />
      )}
    </div>
  );
}
