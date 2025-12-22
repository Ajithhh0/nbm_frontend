import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Timeline from "@/models/Timeline";

/* READ */
export async function GET() {
  await connectDB();
  const items = await Timeline.find().sort({ date: 1 });
  return NextResponse.json(items);
}

/* CREATE */
export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const item = await Timeline.create(data);
  return NextResponse.json(item);
}

/* UPDATE */
export async function PUT(req: Request) {
  await connectDB();
  const { id, ...data } = await req.json();
  const updated = await Timeline.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

/* DELETE */
export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Timeline.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
