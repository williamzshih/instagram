import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/utils/db";
import HomeFeed from "@/components/HomeFeed";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (!user) {
    redirect("/sign-up");
  }

  return <HomeFeed />;
}
