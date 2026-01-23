import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (!path.startsWith("/admin-nbm-x492d")) return;

  const auth = req.cookies.get("admin_auth");

  if (!auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin-nbm-x492d/:path*"],
};
