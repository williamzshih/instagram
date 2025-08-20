import { redirect } from "next/navigation";
import { getProfile } from "@/actions/profile";
import { auth } from "@/auth";
import HomePage from "@/components/HomePage";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.email) redirect("/sign-in");
  const profile = await getProfile({ email: session.user.email });

  return <HomePage profile={profile} />;
}
