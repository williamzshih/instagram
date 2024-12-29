import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  if (req.nextUrl.pathname.startsWith("/user/")) {
    const cookie = req.headers.get("cookie");
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = await fetch(`${req.nextUrl.origin}/api/user`, {
      headers: {
        cookie: cookie,
      },
    });
    const username = await response.json();
    const pathSplit = req.nextUrl.pathname.split("/user/")[1].split("/");
    const pathUsername = pathSplit[0];
    const rest = pathSplit.slice(1).join("/");
    if (username === pathUsername) {
      return NextResponse.redirect(new URL(`/profile/${rest}`, req.nextUrl));
    }
    return NextResponse.next();
  }
});
