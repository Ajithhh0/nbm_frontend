import { connectDB } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: "No ids provided" },
      { status: 400 }
    );
  }

  await DemoRequest.deleteMany({
    _id: { $in: ids },
  });

  return NextResponse.json({ success: true });
}
