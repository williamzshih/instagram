import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const middleware = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user)
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));

  if (req.nextUrl.pathname.startsWith(`/user/${session.user.username}`))
    return NextResponse.redirect(new URL("/profile", req.nextUrl));
};

export const config = {
  matcher: "/user/:path*",
  runtime: "nodejs",
};
