import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HomeFeed from "@/components/HomeFeed";
import { getUserHome } from "@/actions/user";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const user = await getUserHome(1);

  if (!user) {
    redirect("/sign-up");
  }

  return <HomeFeed initialData={user} />;
}
