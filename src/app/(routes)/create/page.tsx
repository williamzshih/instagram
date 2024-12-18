"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPost } from "@/utils/actions";
import Image from "next/image";

const CAPTION_MAX = 1000;

export default function Create() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      image: "",
      caption: "",
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
      setValue("image", url);
    } catch (e) {
      console.log(e);
      toast.error("Trouble uploading file");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <p className="text-2xl font-bold mb-4">Create Post</p>
      <div className="w-96 h-96 rounded-lg bg-gray-200 flex items-center justify-center mb-4">
        <Label
          htmlFor="upload"
          className="w-96 h-96 rounded-lg relative group block cursor-pointer"
        >
          <Image
            src={watch("image")}
            alt=""
            className="w-96 h-96 rounded-lg object-cover group-hover:brightness-75"
            width={384}
            height={384}
          />
          <Upload
            size={40}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 ${
              watch("image") ? "text-white" : "text-gray-500"
            }`}
          />
          <Input
            id="upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => uploadFile(e.target.files?.[0])}
          />
        </Label>
      </div>
      <form
        className="flex flex-col gap-2 w-1/2"
        onSubmit={handleSubmit(async (data) => {
          const id = await createPost(data.image, data.caption);
          toast.success("Post created");
          router.push(`/post/${id}`);
        })}
      >
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-between ${
              errors.caption ? "text-red-500" : ""
            }`}
          >
            <Label>Caption</Label>
            <p className="text-sm text-gray-500">
              {watch("caption")?.length || 0}/{CAPTION_MAX}
            </p>
          </div>
          <Textarea
            {...register("caption", {
              maxLength: {
                value: CAPTION_MAX,
                message: `Caption must be at most ${CAPTION_MAX} characters long`,
              },
            })}
            placeholder="Caption"
            className={`h-52 ${errors.caption ? "border-red-500" : ""}`}
          />
          {errors.caption && (
            <p className="text-red-500 text-sm mt-1">
              {errors.caption.message || "An error occurred"}
            </p>
          )}
        </div>
        <Button className="mt-4 w-fit" type="submit">
          Create post
        </Button>
      </form>
    </div>
  );
}
