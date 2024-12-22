"use client";

import { Button } from "@/components/ui/button";
import { signInAction, signOutAction, getSession } from "@/utils/actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SyncLoader } from "react-spinners";

export default function SignInPage() {
  const queryClient = useQueryClient();

  const {
    data: session,
    isPending: isSessionPending,
    error: sessionError,
  } = useQuery({
    queryKey: ["session", "signInPage"],
    queryFn: () => getSession(),
  });

  const { mutate: signIn } = useMutation({
    mutationFn: () => signInAction(),
  });

  const { mutate: signOut } = useMutation({
    mutationFn: () => signOutAction(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  if (isSessionPending)
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <SyncLoader />
      </div>
    );

  if (sessionError) {
    console.error(sessionError);
    toast.error(sessionError as unknown as string);

    return (
      <div className="flex flex-col justify-center items-center p-4 text-red-500">
        {sessionError as unknown as string}
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
