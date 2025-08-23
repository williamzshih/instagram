"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus, Upload } from "lucide-react";
import localFont from "next/font/local";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createPost } from "@/actions/post";
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
import { useUserStore } from "@/store/user";

const googleSans = localFont({
  src: "../../fonts/GoogleSansCodeVF.ttf",
});

const formSchema = z.object({
  caption: z
    .string()
    .max(CAPTION_MAX, `Caption must be at most ${CAPTION_MAX} characters long`),
  image: z.url(),
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
      form.reset();
      const id = await createPost({ userId: user.id, ...data });
      toast.success("Post created");
      router.push(`/post/${id}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex gap-4">
        <Plus className="size-8" />
        <p className={`text-2xl font-semibold ${googleSans.className}`}>
          Create
        </p>
      </div>
      <Label
        className="group relative flex size-full cursor-pointer justify-center overflow-hidden"
        htmlFor="image"
      >
        {form.watch("image") ? (
          <Image
            alt="Uploaded image"
            className={cn(
              "object-contain transition-all group-hover:brightness-75",
              uploading && "brightness-75"
            )}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={form.watch("image")}
          />
        ) : (
          <div
            className={cn(
              "bg-muted size-full transition-all group-hover:brightness-75",
              uploading && "brightness-75"
            )}
          />
        )}
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
      <Form {...form}>
        <form
          className="flex w-full max-w-md flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
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
