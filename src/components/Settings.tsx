import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Upload } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { uploadFile } from "@/actions/upload";
import { checkUsername, deleteUser, updateUser } from "@/actions/user";
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

type Props = {
  user: {
    bio: string;
    createdAt: Date;
    email?: null | string;
    id?: string;
    image?: null | string;
    name?: null | string;
    username: string;
  };
};

export default function Settings({ user }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const formSchema = z.object({
    bio: z
      .string()
      .max(BIO_MAX, `Bio must be at most ${BIO_MAX} characters long`),
    image: z.string().nullish(),
    name: z
      .string()
      .min(1, "Name is required")
      .min(NAME_MIN, `Name must be at least ${NAME_MIN} characters long`)
      .max(NAME_MAX, `Name must be at most ${NAME_MAX} characters long`)
      .nullish(),
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
      .refine(async (username) => await checkUsername(username), {
        message: "This username is already taken",
      }),
  });

  const form = useForm({
    defaultValues: user,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!user.id) return;
      await updateUser({ data, id: user.id });
      toast.success("Settings updated");
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
      if (!user.id) return;
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
          className="rounded-full block cursor-pointer group relative"
          htmlFor="image"
        >
          <Avatar className="size-40">
            <AvatarImage
              alt="Your profile picture"
              src={
                form.watch("image") ||
                "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
              }
            />
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black opacity-0 hover:opacity-25 transition-opacity" />
          {isUploading ? (
            <LoaderCircle
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-spin"
              size={48}
            />
          ) : (
            <Upload
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block text-white"
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
              setIsUploading(true);
              try {
                const url = await uploadFile(e.target.files[0]);
                form.setValue("image", url);
                toast.success("Image uploaded");
              } catch (error) {
                toast.error((error as Error).message);
              } finally {
                setIsUploading(false);
              }
            }
          }}
          type="file"
        />
      </GradientRing>
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
                <FormLabel className="flex items-center justify-between">
                  Name
                  <p className="text-muted-foreground">
                    {form.watch("name")?.length || 0}/{NAME_MAX}
                  </p>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    value={field.value || ""}
                  />
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
      <div className="grid grid-cols-2 gap-4">
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
      <p className="text-sm text-muted-foreground">
        Account created on {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
