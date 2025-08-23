import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Upload } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { uploadFile } from "@/actions/upload";
import {
  checkUsername,
  deleteUser,
  updateUser as updateUserAction,
} from "@/actions/user";
import GradientRing from "@/components/GradientRing";
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
import { useUserStore } from "@/store/user";

type Props = {
  close: () => void;
  user: Pick<User, "bio" | "createdAt" | "id" | "image" | "name" | "username">;
};

export default function Settings({ close, user }: Props) {
  const [uploading, setUploading] = useState(false);
  const updateUser = useUserStore((state) => state.updateUser);

  const formSchema = z.object({
    bio: z
      .string()
      .max(BIO_MAX, `Bio must be at most ${BIO_MAX} characters long`),
    image: z.string(),
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
          username === user.username || (await checkUsername(username)),
        {
          message: "This username is already taken",
        }
      ),
  });

  const form = useForm({
    defaultValues: user,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      updateUser(data);
      await updateUserAction({ data, id: user.id });
      toast.success("Settings updated");
      close();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been signed out");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await signOut();
      await deleteUser(user.id);
      toast.success("Your account has been deleted");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <GradientRing>
        <Label
          className="group relative block cursor-pointer rounded-full"
          htmlFor="image"
        >
          <Avatar className="size-40 after:absolute after:inset-0 after:rounded-full after:bg-black after:opacity-0 after:transition-opacity hover:after:opacity-25">
            <AvatarImage alt="Your profile picture" src={form.watch("image")} />
          </Avatar>
          {uploading ? (
            <LoaderCircle
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-white"
              size={48}
            />
          ) : (
            <Upload
              className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-white group-hover:block"
              size={48}
            />
          )}
        </Label>
        <Input
          accept="image/*"
          className="hidden"
          id="image"
          onChange={async (e) => {
            if (e.target.files?.[0]) {
              setUploading(true);
              try {
                const url = await uploadFile(e.target.files[0]);
                form.setValue("image", url);
                toast.success("Image uploaded");
              } catch (error) {
                toast.error((error as Error).message);
              } finally {
                setUploading(false);
              }
            }
          }}
          type="file"
        />
      </GradientRing>
      <Form {...form}>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  Username
                  <p className="text-muted-foreground">
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
                <FormLabel className="flex justify-between">
                  Name
                  <p className="text-muted-foreground">
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
                <FormLabel className="flex justify-between">
                  Bio
                  <p className="text-muted-foreground">
                    {form.watch("bio").length}/{BIO_MAX}
                  </p>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Bio" rows={3} {...field} />
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
      <div className="grid grid-cols-2 gap-2">
        <Button
          className="cursor-pointer text-red-500 hover:text-red-500"
          onClick={handleSignOut}
          variant="outline"
        >
          Sign out
        </Button>
        <Button
          className="cursor-pointer"
          onClick={handleDeleteAccount}
          variant="destructive"
        >
          Delete account
        </Button>
      </div>
      <p className="text-muted-foreground text-sm">
        Account created on {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
