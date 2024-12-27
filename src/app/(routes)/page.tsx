import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HomeFeed from "@/components/HomeFeed";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return <HomeFeed />;
}
