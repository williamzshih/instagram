import { redirect } from "next/navigation";
import { getProfile } from "@/actions/profile";
import { auth } from "@/auth";
import ProfilePage from "@/components/ProfilePage";

export default async function Profile() {
  const session = await auth();
  if (!session?.user?.email) redirect("/sign-in");
  const profile = await getProfile({ email: session.user.email });

  return <ProfilePage currentUser profile={profile} />;
}
