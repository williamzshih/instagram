"use client";

import HomePage from "@/components/HomePage";
import { useUserStore } from "@/store/user";

export default function Home() {
  const user = useUserStore((state) => state.user);
  if (!user) return;

  return <HomePage followerId={user.id} />;
}
