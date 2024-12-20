"use client";

import { Button } from "@/components/ui/button";
import { signInAction, signOutAction, getSession } from "@/utils/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
        <Button
          onClick={() => {
            signOutAction();
            queryClient.invalidateQueries({ queryKey: ["session"] });
          }}
        >
          Sign out
        </Button>
      ) : (
        <Button
          onClick={() => {
            signInAction();
            queryClient.invalidateQueries({ queryKey: ["session"] });
          }}
        >
          Sign in
        </Button>
      )}
    </div>
  );
}
