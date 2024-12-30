"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPost } from "@/actions/post";
import { uploadFile } from "@/actions/actions";
import Image from "next/image";
import { CAPTION_MAX } from "@/limits";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  image: z.string(),
  caption: z
    .string()
    .max(CAPTION_MAX, `Caption must be at most ${CAPTION_MAX} characters long`),
});

export default function Create() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      caption: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const id = await createPost(data.image, data.caption);
      form.reset();
      toast.success("Post created");
      router.push(`/post/${id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-bold">Create Post</p>
      <Label
        htmlFor="upload"
        className={`cursor-pointer relative group ${
          form.watch("image") ? "" : "w-96 h-96 bg-muted"
        }`}
      >
        <Image
          src={
            form.watch("image") ||
            "https://upload.wikimedia.org/wikipedia/commons/8/8c/Transparent.png"
          }
          alt="Uploaded image"
          width={1920}
          height={1080}
          className={form.watch("image") ? "max-w-[32rem] max-h-[32rem]" : ""}
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-25" />
        <Upload
          size={48}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white"
        />
      </Label>
      <Input
        id="upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            try {
              const formData = new FormData();
              formData.append("file", e.target.files[0]);
              uploadFile(formData).then((url) => {
                form.setValue("image", url);
              });
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "An error occurred"
              );
            }
          }
        }}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 max-w-md w-full"
        >
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <p>Caption</p>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("caption").length}/{CAPTION_MAX}
                  </p>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Caption" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create post</Button>
        </form>
      </Form>
    </div>
  );
}
