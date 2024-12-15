import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from "lucide-react";

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-between w-full">
        <Button size="icon" variant="ghost">
          <ChevronLeft />
        </Button>
        <p className="text-2xl font-bold">username</p>
        <Button size="icon" variant="ghost">
          <Settings />
        </Button>
      </div>
    </div>
  );
}
