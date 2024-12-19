"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { updateUser, getUser } from "@/utils/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const NAME_MIN = 3;
const NAME_MAX = 20;
const BIO_MAX = 100;

export default function Settings() {
  const router = useRouter();

  const {
    data: user,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const { mutate } = useMutation({
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
    }) => updateUser(avatar, username, name, bio),
    onError: (err) => {
      console.log("Error updating user:", err);
      toast.error("Error updating user");
    },
    onSuccess: () => {
      toast.success("User updated");
      router.push("/profile");
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
    } catch (e) {
      console.log(e);
      toast.error("Trouble uploading file");
    }
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <Skeleton className="mb-4 w-24 h-8" />
        <div className="p-1 rounded-full flex items-center justify-center bg-gradient-to-tr from-gray-300 to-gray-400 mb-4">
          <div className="p-1 bg-white rounded-full">
            <Skeleton className="w-40 h-40 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-14 h-6" />
            </div>
            <Skeleton className="w-full h-9 rounded" />
          </div>
          <div className="flex flex-col gap-1 -mt-1">
            <div className="flex items-center justify-between">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-14 h-6" />
            </div>
            <Skeleton className="w-full h-9 rounded" />
          </div>
          <div className="flex flex-col gap-1 -mt-1">
            <div className="flex items-center justify-between">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-14 h-6" />
            </div>
            <Skeleton className="w-full h-20 rounded" />
          </div>
          <Skeleton className="mt-3 w-32 h-9 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching user:", error);
    toast.error("Error fetching user");
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        Error fetching user: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <p className="text-2xl font-bold mb-4">Profile Settings</p>
      <div className="p-1 rounded-full flex items-center justify-center bg-gradient-to-tr from-ig-orange to-ig-red mb-4">
        <div className="p-1 bg-white rounded-full">
          <Label
            htmlFor="avatar"
            className="w-40 h-40 rounded-full block cursor-pointer"
          >
            <Avatar className="w-40 h-40 rounded-full relative group">
              <AvatarImage
                src={
                  watch("avatar") ||
                  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                }
                alt="Avatar"
                className="w-40 h-40 rounded-full group-hover:brightness-75 object-cover"
              />
              <Upload
                size={40}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white"
              />
            </Avatar>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadFile(e.target.files?.[0])}
            />
          </Label>
        </div>
      </div>
      <form
        className="flex flex-col gap-2 w-1/2"
        onSubmit={handleSubmit((data) => mutate(data))}
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
            className={`h-20 ${errors.bio ? "border-red-500" : ""}`}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bio.message || "An error occurred"}
            </p>
          )}
        </div>
        <Button className="mt-4 w-fit" type="submit">
          Save settings
        </Button>
      </form>
    </div>
  );
}
