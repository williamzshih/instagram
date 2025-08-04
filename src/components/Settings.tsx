import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { checkUsername, deleteUser, updateUser } from "@/actions/profile";
import { uploadFile } from "@/actions/upload";
import Gradient from "@/components/Gradient";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BIO_MAX,
  NAME_MAX,
  NAME_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
} from "@/limits";

type Props = {
  profile: {
    avatar: string;
    bio: string;
    createdAt: Date;
    id: string;
    name: string;
    username: string;
  };
};

export default function Settings({ profile }: Props) {
  // TODO: add email to form schema
  const formSchema = z.object({
    avatar: z.string(),
    bio: z
      .string()
      .max(BIO_MAX, `Bio must be at most ${BIO_MAX} characters long`),
    name: z
      .string()
      .min(1, "Name is required")
      .min(NAME_MIN, `Name must be at least ${NAME_MIN} characters long`)
      .max(NAME_MAX, `Name must be at most ${NAME_MAX} characters long`),
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
          username === profile.username || (await checkUsername(username)),
        {
          message: "This username is already taken",
        }
      ),
  });

  const form = useForm({
    defaultValues: {
      avatar: profile.avatar,
      bio: profile.bio,
      name: profile.name,
      username: profile.username,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updateUser(profile.id, data);
      toast.success("Settings updated");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Gradient>
        <Label className="rounded-full block cursor-pointer" htmlFor="avatar">
          <Avatar className="w-40 h-40 group">
            <AvatarImage
              alt="Your avatar"
              className="object-cover rounded-full"
              src={form.watch("avatar")}
            />
            <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-25" />
            <Upload
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white"
              size={40}
            />
          </Avatar>
        </Label>
        <Input
          accept="image/*"
          className="hidden"
          id="avatar"
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
          type="file"
        />
      </Gradient>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
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
          <Button className="cursor-pointer" type="submit">
            Save settings
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-center gap-2">
        {/* TODO: fix sign out */}
        <Button
          className="cursor-pointer"
          onClick={() => signOut({ redirectTo: "/sign-in" })}
          variant="destructive"
        >
          Sign out
        </Button>
        {/* TODO: fix delete account */}
        <Button
          className="cursor-pointer"
          onClick={async () => {
            signOut({ redirectTo: "/sign-in" });
            await deleteUser(profile.id);
          }}
          variant="destructive"
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
