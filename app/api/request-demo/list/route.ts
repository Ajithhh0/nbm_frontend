import { connectDB } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";
import { NextResponse } from "next/server";

type Status = "new" | "contacted" | "responded";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const search = (searchParams.get("search") || "").trim();

  // ✅ normalize status: trim + lowercase
  const statusRaw = (searchParams.get("status") || "").trim().toLowerCase();
  const status = (["new", "contacted", "responded"] as const).includes(
    statusRaw as Status
  )
    ? (statusRaw as Status)
    : "";

  const limit = 10;

  // ✅ no any, ESLint-safe
  const query: Record<string, unknown> = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  // 🔎 helpful dev log (remove later)
  console.log("[request-demo/list] query:", query);

  const total = await DemoRequest.countDocuments(query);
  const pages = Math.max(1, Math.ceil(total / limit));

  const items = await DemoRequest.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // ✅ ALWAYS return the same shape
  return NextResponse.json({ items, pages });
}
