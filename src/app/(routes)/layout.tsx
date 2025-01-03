import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import MobileNav from "@/components/MobileNav";
import DesktopNav from "@/components/DesktopNav";
import QueryProvider from "@/components/QueryProvider";
import { ThemeProvider } from "next-themes";
import { auth } from "@/auth";
import ThemeSwitch from "@/components/ThemeSwitch";
import { getUser } from "@/actions/user";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  title: "Instagram",
  description: "Instagram",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  let showNav = false;
  const session = await auth();

  if (session) {
    const user = await getUser();

    if (user) {
      showNav = true;
    }
  }

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
