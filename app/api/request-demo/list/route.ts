import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";

export async function GET(req: Request) {
  const key = req.headers.get("x-admin-key");
  if (key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const data = await DemoRequest.find()
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  return NextResponse.json(data);
}
