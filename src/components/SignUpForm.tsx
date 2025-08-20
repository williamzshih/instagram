"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { checkUsername } from "@/actions/profile";
import { createUser } from "@/actions/profile";
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
import { USERNAME_MAX, USERNAME_MIN } from "@/limits";

const formSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username is required",
    })
    .min(USERNAME_MIN, {
      message: `Username must be at least ${USERNAME_MIN} characters`,
    })
    .max(USERNAME_MAX, {
      message: `Username must be at most ${USERNAME_MAX} characters`,
    })
    .refine(checkUsername, {
      message: "This username is already taken",
    }),
});

export default function SignUpForm({ session }: { session: Session }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      username: "",
    },
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await createUser(
        session.user?.email || "",
        data.username,
        session.user?.name || "",
        session.user?.image || undefined
      );
      toast.success("User created");
      router.push("/");
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                <p>Username</p>
                <p className="text-sm text-muted-foreground">
                  {form.watch("username").length}/{USERNAME_MAX}
                </p>
              </FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </Form>
  );
}
