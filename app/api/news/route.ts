import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { News } from "@/models/News";

export async function GET() {
  await connectDB();
  const items = await News.find().sort({ date: -1 });
  return NextResponse.json({ news: items });
}

export async function POST(req: NextRequest) {
  await connectDB();

  const { title } = await req.json();
  if (!title || title.trim() === "") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const item = await News.create({ title });

  return NextResponse.json({ news: item }, { status: 201 });
}
