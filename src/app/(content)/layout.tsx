import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import UserInitializer from "@/components/UserInitializer";

export default async function ContentLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <>
      <UserInitializer user={session.user}>
        {modal}
        <div className="flex">
          <DesktopNav />
          <div className="mb-24 flex-1 p-4 lg:mb-0">{children}</div>
        </div>
        <MobileNav />
      </UserInitializer>
    </>
  );
}
