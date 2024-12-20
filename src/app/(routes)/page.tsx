"use client";

import { Button } from "@/components/ui/button";
import { signInAction, signOutAction, getSession } from "@/utils/actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Home() {
  const queryClient = useQueryClient();

  const {
    data: session,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
  });

  const { mutate: signIn } = useMutation({
    mutationFn: () => signInAction(),
  });

  const { mutate: signOut } = useMutation({
    mutationFn: () => signOutAction(),
    onSuccess: () => {
      toast.success("Signed out");
      queryClient.clear();
    },
  });

  if (isPending)
    return (
      <div className="flex flex-col justify-center items-center p-4">
        Loading...
      </div>
    );

  if (isError) {
    console.error("Error fetching session:", error);
    toast.error("Error fetching session");
    return (
      <div className="flex flex-col justify-center items-center p-4 text-red-500">
        Error fetching session: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center p-4">
      {session ? (
        <Button onClick={() => signOut()}>Sign out</Button>
      ) : (
        <Button onClick={() => signIn()}>Sign in</Button>
      )}
    </div>
  );
}
