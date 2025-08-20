import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { redirect } from "next/navigation";
import { getProfileRedirect } from "@/actions/profile";
import { auth } from "@/auth";
import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import QueryProvider from "@/components/QueryProvider";
import ThemeSwitch from "@/components/ThemeSwitch";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  description: "Instagram",
  title: "Instagram",
};

export default async function RootLayout({
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <QueryProvider>
            <ThemeSwitch />
            {modal}
            <div className="flex">
              {showNav && <DesktopNav />}
              <div className="flex-1 p-4 mb-16 md:mb-0">{children}</div>
            </div>
            {showNav && <MobileNav />}
            <Toaster position="bottom-left" />
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
