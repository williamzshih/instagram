import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  USERNAME_MIN,
  USERNAME_MAX,
  NAME_MIN,
  NAME_MAX,
  BIO_MAX,
} from "@/limits";
import { uploadFile } from "@/actions/actions";
import {
  isUsernameAvailable,
  updateUser,
  deleteUser,
  type Profile,
} from "@/actions/profile";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import Gradient from "@/components/Gradient";

export default function Settings({ profile }: { profile: Profile }) {
  // TODO: add email to form schema
  const formSchema = z.object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(
        USERNAME_MIN,
        `Username must be at least ${USERNAME_MIN} characters long`
      )
      .max(
        USERNAME_MAX,
        `Username must be at most ${USERNAME_MAX} characters long`
      )
      .refine(
        async (username) =>
          username === profile.username ||
          (await isUsernameAvailable(username)),
        {
          message: "This username is already taken",
        }
      ),
    name: z
      .string()
      .min(1, "Name is required")
      .min(NAME_MIN, `Name must be at least ${NAME_MIN} characters long`)
      .max(NAME_MAX, `Name must be at most ${NAME_MAX} characters long`),
    bio: z
      .string()
      .max(BIO_MAX, `Bio must be at most ${BIO_MAX} characters long`),
    avatar: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updateUser(profile.username, data);
      toast.success("Settings updated");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Gradient>
        <Label htmlFor="avatar" className="rounded-full block cursor-pointer">
          <Avatar className="w-40 h-40 group">
            <AvatarImage
              src={form.watch("avatar")}
              alt="Your avatar"
              className="object-cover rounded-full"
            />
            <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-25" />
            <Upload
              size={40}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white"
            />
          </Avatar>
        </Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0])
              try {
                uploadFile(e.target.files[0]).then((url) =>
                  form.setValue("avatar", url)
                );
                toast.success("Avatar updated");
              } catch (error) {
                toast.error((error as Error).message);
              }
          }}
        />
      </Gradient>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <p>Username</p>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("username").length}/{USERNAME_MAX}
                  </p>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <p>Name</p>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("name").length}/{NAME_MAX}
                  </p>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <p>Bio</p>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("bio").length}/{BIO_MAX}
                  </p>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Bio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="cursor-pointer">
            Save settings
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-center gap-2">
        {/* TODO: fix sign out */}
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={() => signOut({ redirectTo: "/sign-in" })}
        >
          Sign out
        </Button>
        {/* TODO: fix delete account */}
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={async () => {
            signOut({ redirectTo: "/sign-in" });
            await deleteUser(profile.username);
          }}
        >
          Delete account
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Account created on {profile.createdAt.toLocaleDateString()}
      </p>
    </div>
  );
}
