import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <p className="text-2xl font-bold mb-4">Settings</p>
      <div className="p-1 rounded-full flex items-center justify-center bg-gradient-to-tr from-ig-orange to-ig-red mb-4">
        <div className="bg-white p-1 rounded-full">
          <Avatar className="w-40 h-40 group relative">
            <AvatarImage
              src="https://picsum.photos/200/300"
              className="rounded-full group-hover:brightness-75"
            />
            <Upload
              size={40}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white"
            />
          </Avatar>
        </div>
      </div>
      <form className="flex flex-col gap-2 w-1/2">
        <div className="flex flex-col">
          <p>Username</p>
          <Input placeholder="Username" />
        </div>
        <div className="flex flex-col">
          <p>Name</p>
          <Input placeholder="Name" />
        </div>
        <div className="flex flex-col">
          <p>Bio</p>
          <Textarea className="h-20" placeholder="Bio" />
        </div>
        <div className="flex flex-col">
          <p>Password</p>
          <Input placeholder="Password" />
        </div>
        <div className="flex flex-col">
          <p>Confirm Password</p>
          <Input placeholder="Confirm Password" />
        </div>
        <Button className="mt-4 w-fit">Save settings</Button>
      </form>
    </div>
  );
}
