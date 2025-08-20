import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DesktopNav from "@/components/DesktopNav";
import IdInitializer from "@/components/IdInitializer";
import MobileNav from "@/components/MobileNav";
import { prisma } from "@/db";

export default async function ContentLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user?.email) redirect("/sign-in");
  const profile = await prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email: session.user.email,
    },
  });
  if (!profile) redirect("/sign-up");

  return (
    <>
      <IdInitializer id={profile.id}>
        {modal}
        <div className="flex">
          <DesktopNav />
          <div className="flex-1 p-4 mb-16 lg:mb-0">{children}</div>
        </div>
        <MobileNav />
      </IdInitializer>
    </>
  );
}
