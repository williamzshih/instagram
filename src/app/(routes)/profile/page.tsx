import { getProfile } from "@/actions/profile";
import ProfilePage from "@/components/ProfilePage";
import { redirect } from "next/navigation";

export default async function Profile() {
  const profile = await getProfile();

  if (!profile) redirect("/sign-up"); // TODO: redirect somewhere else

  return <ProfilePage profile={profile} />;
}
