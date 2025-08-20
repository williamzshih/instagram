"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

const formSchema = z.object({
  caption: z
    .string()
    .max(CAPTION_MAX, `Caption must be at most ${CAPTION_MAX} characters long`),
  image: z.string(),
});

export default function Create() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      caption: "",
      image: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const id = await createPost(data);
      form.reset();
      toast.success("Post created");
      router.push(`/post/${id}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-bold">Create Post</p>
      <Label
        className={cn(
          "cursor-pointer relative group",
          !form.watch("image") && "w-1/3 h-1/3 bg-muted"
        )}
        htmlFor="image"
      >
        <Image
          alt="Uploaded image"
          className={cn(form.watch("image") && "max-w-[32rem] max-h-[32rem]")}
          height={1080}
          src={
            form.watch("image") ||
            "https://upload.wikimedia.org/wikipedia/commons/8/8c/Transparent.png"
          }
          width={1920}
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 transition-opacity" />
        <Upload
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white"
          size={48}
        />
      </Label>
      <Input
        accept="image/*"
        className="hidden"
        id="image"
        onChange={(e) => {
          if (e.target.files?.[0])
            try {
              uploadFile(e.target.files[0]).then((url) =>
                form.setValue("image", url)
              );
              toast.success("Image uploaded");
            } catch (error) {
              toast.error((error as Error).message);
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
          <Button className="cursor-pointer" type="submit">
            Create post
          </Button>
        </form>
      </Form>
    </div>
  );
}
