import { NextResponse } from "next/server";
import { Parser } from "json2csv";

import { connectDB } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";

export async function GET(req: Request) {
  const key =
    req.headers.get("x-admin-key") ||
    new URL(req.url).searchParams.get("key");

  if (key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const data = await DemoRequest.find().sort({ createdAt: -1 }).lean();
  const csv = new Parser({
    fields: ["name", "email", "ip", "createdAt"],
  }).parse(data);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=demo_requests.csv",
    },
  });
}
