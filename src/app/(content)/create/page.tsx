"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createPost } from "@/actions/create";
import { uploadFile } from "@/actions/upload";
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
import { cn } from "@/lib/utils";
import { CAPTION_MAX } from "@/limits";
import { useUserStore } from "@/store/userStore";

const formSchema = z.object({
  caption: z
    .string()
    .max(CAPTION_MAX, `Caption must be at most ${CAPTION_MAX} characters long`),
  image: z.string(),
});

export default function Create() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const form = useForm({
    defaultValues: {
      caption: "",
    },
    resolver: zodResolver(formSchema),
  });
  const user = useUserStore((state) => state.user);
  if (!user) return;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!user.id) return;
      form.reset();
      const id = await createPost({ realUserId: user.id, ...data });
      toast.success("Post created");
      router.push(`/post/${id}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-semibold">Create Post</h1>
      <Label
        className="cursor-pointer group size-1/3 relative aspect-square"
        htmlFor="image"
      >
        {form.watch("image") ? (
          <Image
            alt="Uploaded image"
            className={cn(
              "hover:brightness-75 transition-all",
              uploading && "brightness-75"
            )}
            height={500}
            src={`${form.watch("image")}?img-width=500&img-height=500`}
            width={500}
          />
        ) : (
          <div
            className={cn(
              "size-full bg-muted hover:brightness-75 transition-all",
              uploading && "brightness-75"
            )}
          />
        )}
        {uploading ? (
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
      <Form {...form}>
        <form
          className="flex flex-col gap-4 max-w-md w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  Caption
                  <p className="text-muted-foreground">
                    {form.watch("caption").length}/{CAPTION_MAX}
                  </p>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Caption" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="cursor-pointer" type="submit">
            Create post
          </Button>
        </form>
      </Form>
    </div>
  );
}
