import { connectDB } from "@/lib/mongodb";
import  News from "@/models/News";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;   // ✔ works now

  await connectDB();

  const item = await News.findById(id).lean();

  if (!item) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16 text-white">
        <p>News article not found.</p>
        <Link href="/news" className="text-cyan-400 mt-4 inline-block">
          ← Back to news
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-white">
      <Link href="/news" className="text-cyan-400 text-sm mb-4 inline-block">
        ← Back to news
      </Link>

      <h1 className="text-3xl font-semibold mb-2">{item.title}</h1>
      <p className="text-xs text-white/40 mb-6">
        {new Date(item.date).toLocaleString()}
      </p>

      <article className="prose prose-invert max-w-none text-sm leading-relaxed">
        <ReactMarkdown>{item.content}</ReactMarkdown>
      </article>
    </main>
  );
}
