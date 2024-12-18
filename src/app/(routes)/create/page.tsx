"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";

const CAPTION_MAX = 1000;

export default function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      caption: "",
    },
  });

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-around w-full">
        <div className="w-96 h-96 rounded-lg bg-gray-200 flex items-center justify-center">
          <label
            htmlFor="upload"
            className="w-96 h-96 rounded-lg relative group block cursor-pointer"
          >
            <Upload
              size={40}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-500"
            />
            <Input
              id="upload"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-between ${
              errors.caption ? "text-red-500" : ""
            }`}
          >
            <p>Caption</p>
            <p className="text-sm text-gray-500">
              {watch("caption")?.length ?? 0}/{CAPTION_MAX}
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
            className={`h-20 ${errors.caption ? "border-red-500" : ""}`}
          />
          {errors.caption && (
            <p className="text-red-500 text-sm mt-1">
              {errors.caption.message ?? "An error occurred"}
            </p>
          )}
        </div>
      </div>
      <Button className="mt-4 w-fit" type="submit">
        Create
      </Button>
    </div>
  );
}
