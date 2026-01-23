import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  cookieStore.delete("admin_auth_time");

  return NextResponse.json({ success: true });
}
