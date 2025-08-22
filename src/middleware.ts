import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const middleware = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));

  if (req.nextUrl.pathname.startsWith(`/user/${session.user.username}`))
    return NextResponse.redirect(new URL("/profile", req.url));

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!sign-in|api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
