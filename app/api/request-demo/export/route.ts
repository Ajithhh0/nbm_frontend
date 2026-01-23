import { connectDB } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";

export async function GET() {
  await connectDB();

  const items = await DemoRequest.find().lean();

  const csv = [
    ["Name", "Email", "Status", "IP", "Created At"],
    ...items.map((r) => [
      r.name,
      r.email,
      r.status,
      r.ip,
      r.createdAt.toISOString(),
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=demo-requests.csv",
    },
  });
}
