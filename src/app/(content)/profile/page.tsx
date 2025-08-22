"use client";

import ProfilePage from "@/components/ProfilePage";
import { useUserStore } from "@/store/userStore";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  if (!user) return;

  return <ProfilePage currentUser user={user} />;
}
