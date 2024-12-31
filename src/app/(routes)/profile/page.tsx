import { getUserProfile } from "@/actions/user";
import CurrentProfilePage from "@/components/CurrentProfilePage";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/sign-up");
  }

  return <CurrentProfilePage user={user} />;
}
