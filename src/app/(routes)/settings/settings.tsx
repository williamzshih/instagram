"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";
import { updateUser, getUser } from "./actions";

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const NAME_MIN = 3;
const NAME_MAX = 20;
const BIO_MAX = 100;

export default function Settings({ session }: { session: Session | null }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    watch,
  } = useForm({
    mode: "onTouched",
    defaultValues: async () => {
      const user = await getUser(session?.user?.email ?? "");
      return {
        avatar: null,
        username: user?.username ?? "",
        name: user?.name ?? "",
        bio: user?.bio ?? "",
      };
    },
  });

  const usernameLength = watch("username")?.length ?? 0;
  const nameLength = watch("name")?.length ?? 0;
  const bioLength = watch("bio")?.length ?? 0;

  const onSubmit = async (data: any) => {
    let avatar = "";
    if (data.avatar[0]) {
      const file = data.avatar[0];
      const reader = new FileReader();
      avatar = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    updateUser(
      session?.user?.email ?? "",
      avatar,
      data.username,
      data.name,
      data.bio
    );
  };

  if (isLoading) {
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
              {...register("avatar")}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
      </div>
      <form
        className="flex flex-col gap-2 w-1/2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-between ${
              errors.username ? "text-red-500" : ""
            }`}
          >
            <p>Username</p>
            <p className="text-sm text-gray-500">
              {usernameLength}/{USERNAME_MAX}
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
              {errors.username.message?.toString() ?? "An error occurred"}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-between ${
              errors.name ? "text-red-500" : ""
            }`}
          >
            <p>Name</p>
            <p className="text-sm text-gray-500">
              {nameLength}/{NAME_MAX}
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
              {errors.name.message?.toString() ?? "An error occurred"}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-between ${
              errors.bio ? "text-red-500" : ""
            }`}
          >
            <p>Bio</p>
            <p className="text-sm text-gray-500">
              {bioLength}/{BIO_MAX}
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
              {errors.bio.message?.toString() ?? "An error occurred"}
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
