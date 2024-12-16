import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { prisma } from "@/db";
import { auth } from "@/auth";

export default async function Settings() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <p className="text-2xl font-bold mb-4">Settings</p>
      <div className="p-1 rounded-full flex items-center justify-center bg-gradient-to-tr from-ig-orange to-ig-red mb-4">
        <div className="p-1 bg-white rounded-full">
          <label
            htmlFor="avatar"
            className="w-40 h-40 rounded-full block cursor-pointer"
          >
            <Avatar className="w-40 h-40 rounded-full relative group">
              <AvatarImage
                src="https://picsum.photos/200/300"
                className="w-40 h-40 rounded-full group-hover:brightness-75"
              />
              <Upload
                size={40}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white"
              />
            </Avatar>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
      </div>
      <form
        className="flex flex-col gap-2 w-1/2"
        action={async (formData) => {
          "use server";
          await prisma.user.update({
            where: {
              email: session?.user?.email ?? "",
            },
            data: {
              avatar: formData.get("avatar") as string || "avatar",
              username: formData.get("username") as string,
              name: formData.get("name") as string,
              bio: formData.get("bio") as string,
            },
          });
        }}
      >
        <div className="flex flex-col">
          <p>Username</p>
          <Input name="username" placeholder="Username" />
        </div>
        <div className="flex flex-col">
          <p>Name</p>
          <Input name="name" placeholder="Name" />
        </div>
        <div className="flex flex-col">
          <p>Bio</p>
          <Textarea name="bio" className="h-20" placeholder="Bio" />
        </div>
        <div className="flex flex-col">
          <p>Password</p>
          <Input name="password" placeholder="Password" />
        </div>
        <div className="flex flex-col">
          <p>Confirm Password</p>
          <Input name="confirmPassword" placeholder="Confirm Password" />
        </div>
        <Button className="mt-4 w-fit">Save settings</Button>
      </form>
    </div>
  );
}
