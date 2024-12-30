"use client";

import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { USERNAME_MIN, USERNAME_MAX } from "@/limits";
import { isUsernameAvailable, createUser } from "@/actions/user";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";

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
    .refine(isUsernameAvailable, {
      message: "This username is already taken",
    }),
});

export default function SignUpForm({ session }: { session: Session }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
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
    } catch (error) {
      toast.error((error as Error).message);
    }

    redirect("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
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
