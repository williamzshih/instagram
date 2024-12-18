"use client";

import { useForm } from "react-hook-form";
import { createComment } from "@/utils/actions";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";

const COMMENT_MAX = 1000;

export default function CommentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  return (
    <form
      className="flex flex-col gap-2 w-full"
      onSubmit={handleSubmit(async (data) => {
        await createComment(data.comment);
        toast.success("Comment created");
      })}
    >
      <div className="flex flex-col">
        <Textarea
          {...register("comment", {
            required: "Comment is required",
            maxLength: {
              value: COMMENT_MAX,
              message: `Comment must be at most ${COMMENT_MAX} characters long`,
            },
          })}
          placeholder="Comment"
          className={`h-52 ${errors.comment ? "border-red-500" : ""}`}
        />
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1">
            {errors.comment.message ?? "An error occurred"}
          </p>
        )}
      </div>
      <div className="flex justify-end">
        <Button className="mt-4 w-fit" type="submit">
          Post comment
        </Button>
      </div>
    </form>
  );
}
