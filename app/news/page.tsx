"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import HorizontalTimeline from "@/components/timeline/HorizontalTimeline";

type NewsItem = {
  _id: string;
  title: string;
  content: string;
  category: string;
  date: string;
};

const PAGE_SIZE = 5;

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "update", label: "Updates" },
  { value: "research", label: "Research" },
  { value: "release", label: "Releases" },
  { value: "announcement", label: "Announcements" },
];

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  async function loadPage(reset = false, newCategory?: string) {
    setLoading(true);
    const currentCategory = newCategory ?? category;

    const res = await fetch(
      `/api/news?page=${reset ? 1 : page}&limit=${PAGE_SIZE}&category=${currentCategory}`
    );
    const data = await res.json();

    if (reset) {
      setItems(data.news);
      setPage(2);
    } else {
      setItems((prev) => [...prev, ...data.news]);
      setPage((p) => p + 1);
    }

    setHasMore(data.page < data.pages);
    setLoading(false);
  }

  useEffect(() => {
    loadPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setCategory(value);
    setPage(1);
    loadPage(true, value);
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 text-white">

      {/* ================= TIMELINE (OPTION 3) ================= */}
      <div className="mb-12 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <HorizontalTimeline />
      </div>

      {/* ================= NEWS ================= */}
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Project News</h1>
            <p className="text-sm text-white/60">
              Updates about NeuroBioMark, software, datasets, and research.
            </p>
          </div>

          <div>
            <label className="block text-xs mb-1 text-white/60">
              Filter by category
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="px-3 py-2 rounded bg-black/60 border border-white/20 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* News list */}
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item._id}
              className="border border-white/10 rounded-xl p-4 bg-white/5"
            >
              <Link href={`/news/item?id=${item._id}`}>
                <h2 className="text-lg font-semibold hover:underline">
                  {item.title}
                </h2>
              </Link>

              <p className="text-xs text-white/40 mt-1">
                {new Date(item.date).toLocaleString()} ·{" "}
                {
                  CATEGORIES.find((c) => c.value === item.category)?.label ??
                  "Update"
                }
              </p>

              <div className="mt-3 text-sm text-white/80 line-clamp-3">
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>

              <Link
                href={`/news/item?id=${item._id}`}
                className="inline-block mt-3 text-sm text-cyan-400 hover:text-cyan-300"
              >
                Read more →
              </Link>
            </article>
          ))}

          {items.length === 0 && !loading && (
            <p className="text-sm text-white/60">No news found.</p>
          )}
        </div>

        {/* Pagination */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              disabled={loading}
              onClick={() => loadPage()}
              className="px-4 py-2 rounded bg-white/10 border border-white/20 text-sm hover:bg-white/20 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
