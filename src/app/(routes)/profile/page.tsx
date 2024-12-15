import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings, BadgeCheck } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-between w-full mb-4">
        <Button size="icon" variant="ghost">
          <ChevronLeft />
        </Button>
        <div className="flex items-center justify-center gap-2">
          <p className="text-2xl font-bold">username</p>
          <BadgeCheck />
        </div>
        <Button size="icon" variant="ghost">
          <Settings />
        </Button>
      </div>
      <div className="w-46 h-46 p-2 rounded-full flex items-center justify-center bg-gradient-to-tr from-ig-orange to-ig-red">
        <div className="bg-white w-42 h-42 p-2 rounded-full">
          <Avatar className="w-40 h-40">
            <AvatarImage src="https://picsum.photos/200/300" />
          </Avatar>
        </div>
      </div>
    </div>
  );
}
