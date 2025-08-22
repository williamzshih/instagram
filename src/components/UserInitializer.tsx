"use client";

import { User } from "next-auth";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export default function UserInitializer({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user.id !== useUserStore.getState().user?.id) setUser(user);
  }, [user, setUser]);

  return children;
}
