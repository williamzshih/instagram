import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const middleware = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  return NextResponse.next();
};

export const config = {
  matcher: "/",
  runtime: "nodejs",
};
