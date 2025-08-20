import type { Metadata } from "next";
import "../globals.css";
import { redirect } from "next/navigation";
import { getProfileRedirect } from "@/actions/profile";
import { auth } from "@/auth";
import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  description: "Instagram",
  title: "Instagram",
};

export default async function ContentLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user?.email) redirect("/sign-in");
  const profile = await getProfileRedirect({ email: session.user.email });
  if (!profile) redirect("/sign-up");
  const showNav = true;

  return (
    <>
      {modal}
      <div className="flex">
        {showNav && <DesktopNav />}
        <div className="flex-1 p-4 mb-16 md:mb-0">{children}</div>
      </div>
      {showNav && <MobileNav />}
    </>
  );
}
