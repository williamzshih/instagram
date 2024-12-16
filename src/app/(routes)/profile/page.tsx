import { auth } from "@/auth";
import Profile from "./profile";

export default async function ProfilePage() {
  const session = await auth();
  return <Profile session={session} />;
}
