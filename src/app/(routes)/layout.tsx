import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import MobileNav from "@/components/MobileNav";
import DesktopNav from "@/components/DesktopNav";
import QueryProvider from "@/components/QueryProvider";
import { ThemeProvider } from "next-themes";

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

export default function RootLayout({
  modal,
  children,
}: Readonly<{
  modal: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <QueryProvider>
            {modal}
            <div className="flex">
              <DesktopNav />
              <div className="flex-1">{children}</div>
            </div>
            <MobileNav />
            <Toaster position="bottom-left" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
