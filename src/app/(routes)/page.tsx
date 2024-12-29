import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HomeFeed from "@/components/HomeFeed";
import { getUser } from "@/utils/actions";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const user = await getUser();

  if (!user) {
    redirect("/sign-up");
  }

  return <HomeFeed user={user} />;
}
