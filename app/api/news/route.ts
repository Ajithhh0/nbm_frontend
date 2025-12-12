import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";


export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "5", 10), 1);
    const category = searchParams.get("category");

    const query: { category?: string } = {};
    if (category && category !== "all") {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      News.countDocuments(query),
    ]);

    return NextResponse.json({
      news,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/news error:", err);
    return NextResponse.json(
      { news: [], error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { title, content, category } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const created = await News.create({
      title,
      content,
      category: category || "update",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/news error:", err);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}


export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { id, title, content, category } = await req.json();

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    if (!updated) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/news error:", err);
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    await News.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/news error:", err);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
