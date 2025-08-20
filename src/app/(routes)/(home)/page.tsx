import { redirect } from "next/navigation";
import { getProfileRedirect } from "@/actions/profile";
import { auth } from "@/auth";
import HomePage from "@/components/HomePage";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.email) redirect("/sign-in");
  const profile = await getProfileRedirect({ email: session.user.email });
  if (!profile) redirect("/sign-up");

  return <HomePage profile={profile} />;
}
