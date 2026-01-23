import { connectDB } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";
import { NextResponse } from "next/server";

/* ---------------- PATCH (status / notes) ---------------- */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params; // ✅ FIX
  const body = await req.json();

  const updated = await DemoRequest.findByIdAndUpdate(
    id,
    body,
    { new: true }
  );

  return NextResponse.json(updated);
}

/* ---------------- DELETE ---------------- */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params; // ✅ FIX

  await DemoRequest.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
