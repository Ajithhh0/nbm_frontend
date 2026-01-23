export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

console.log("HASH VALUE =", process.env.ADMIN_PASSWORD_HASH);


export async function POST(req: Request) {
  const { email, password } = await req.json();

console.log("ENV EMAIL =", process.env.ADMIN_EMAIL);
console.log("REQ EMAIL =", email);
console.log("HAS HASH =", !!process.env.ADMIN_PASSWORD_HASH);


  if (email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const ok = bcrypt.compareSync(
    password,
    process.env.ADMIN_PASSWORD_HASH!
  );

  if (!ok) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // ✅ FIX: cookies() is async
  const cookieStore = await cookies();

  cookieStore.set("admin_auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  cookieStore.set("admin_auth_time", Date.now().toString(), {
    httpOnly: true,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
