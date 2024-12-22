"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { upsertUser, getUser, signOutAction } from "@/utils/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SyncLoader } from "react-spinners";

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const NAME_MIN = 3;
const NAME_MAX = 20;
const BIO_MAX = 100;

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isPending: isUserPending,
    error: userError,
  } = useQuery({
    queryKey: ["user", "settingsPage"],
    queryFn: () => getUser(),
  });

  const { mutate: upsertUserMutation } = useMutation({
    mutationFn: ({
      avatar,
      username,
      name,
      bio,
    }: {
      avatar: string;
      username: string;
      name: string;
      bio: string;
    }) => upsertUser(avatar, username, name, bio),
    onError: (error) => {
      console.error(error);
      toast.error(error as unknown as string);
    },
    onSuccess: (data) => {
      toast.success(
        data.updateOrInsert === "update" ? "User updated" : "User created"
      );
      router.push("/profile");
    },
  });

  const { mutate: signOutMutation } = useMutation({
    mutationFn: () => signOutAction(),
    onSuccess: () => {
      queryClient.clear();
      router.push("/sign-in");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onTouched",
    values: {
      avatar: user?.avatar || "",
      username: user?.username || "",
      name: user?.name || "",
      bio: user?.bio || "",
    },
  });

  const uploadFile = async (file: File | null | undefined) => {
    try {
      if (!file) {
        toast.error("No file selected");
        return;
      }

      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const url = await uploadRequest.json();
      setValue("avatar", url);
    } catch (error) {
      console.error(error);
      toast.error(error as unknown as string);
    }
  };

  if (isUserPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <SyncLoader />
      </div>
    );
  }

  if (userError) {
    console.error(userError);
    toast.error(userError as unknown as string);

    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        {userError as unknown as string}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <p className="text-2xl font-bold">Profile Settings</p>
      <div className="p-1 rounded-full bg-gradient-to-tr from-ig-orange to-ig-red flex items-center justify-center">
        <div className="p-1 rounded-full bg-white">
          <Label htmlFor="avatar" className="rounded-full block cursor-pointer">
            <Avatar className="w-40 h-40 group">
              <AvatarImage
                src={
                  watch("avatar") ||
                  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                }
                alt="User avatar"
                className="rounded-full group-hover:brightness-75 object-cover"
              />
              <Upload
                size={40}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 ${
                  watch("avatar") === "" ||
                  watch("avatar") ===
                    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                    ? "text-gray-500"
                    : "text-white"
                }`}
              />
            </Avatar>
          </Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => uploadFile(e.target.files?.[0])}
          />
        </div>
      </div>
      <form
        className="flex flex-col gap-2 w-1/2"
        onSubmit={handleSubmit((data) => upsertUserMutation(data))}
      >
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-between ${
              errors.username ? "text-red-500" : ""
            }`}
          >
            <Label>Username</Label>
            <p className="text-sm text-gray-500">
              {watch("username")?.length || 0}/{USERNAME_MAX}
            </p>
          </div>
          <Input
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: USERNAME_MIN,
                message: `Username must be at least ${USERNAME_MIN} characters long`,
              },
              maxLength: {
                value: USERNAME_MAX,
                message: `Username must be at most ${USERNAME_MAX} characters long`,
              },
            })}
            placeholder="Username"
            className={`${errors.username ? "border-red-500" : ""}`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message || "An error occurred"}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-between ${
              errors.name ? "text-red-500" : ""
            }`}
          >
            <Label>Name</Label>
            <p className="text-sm text-gray-500">
              {watch("name")?.length || 0}/{NAME_MAX}
            </p>
          </div>
          <Input
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: NAME_MIN,
                message: `Name must be at least ${NAME_MIN} characters long`,
              },
              maxLength: {
                value: NAME_MAX,
                message: `Name must be at most ${NAME_MAX} characters long`,
              },
            })}
            placeholder="Name"
            className={`${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message || "An error occurred"}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-between ${
              errors.bio ? "text-red-500" : ""
            }`}
          >
            <Label>Bio</Label>
            <p className="text-sm text-gray-500">
              {watch("bio")?.length || 0}/{BIO_MAX}
            </p>
          </div>
          <Textarea
            {...register("bio", {
              maxLength: {
                value: BIO_MAX,
                message: `Bio must be at most ${BIO_MAX} characters long`,
              },
            })}
            placeholder="Bio"
            className={`h-24 ${errors.bio ? "border-red-500" : ""}`}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bio.message || "An error occurred"}
            </p>
          )}
        </div>
        <Button className="w-fit self-center" type="submit">
          Save settings
        </Button>
      </form>
      <Button onClick={() => signOutMutation()}>Sign out</Button>
    </div>
  );
}
