import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { News } from "@/models/News";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const category = searchParams.get("category");

  const query: any = {};
  if (category && category !== "all") {
    query.category = category;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    News.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    News.countDocuments(query),
  ]);

  return NextResponse.json({
    news: items,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  await connectDB();

  const { title, content, category } = await req.json();

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 }
    );
  }

  const item = await News.create({
    title,
    content,
    category: category || "update",
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await connectDB();

  const { id, title, content, category } = await req.json();
  if (!id || !title || !content) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const updated = await News.findByIdAndUpdate(
    id,
    {
      title,
      content,
      category: category || "update",
    },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  await connectDB();

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await News.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
