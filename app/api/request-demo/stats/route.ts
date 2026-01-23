import { connectDB } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";

export async function GET() {
  await connectDB();

  const data = await DemoRequest.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return Response.json(data);
}
