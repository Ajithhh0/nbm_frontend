"use client";

import { useState, useEffect } from "react";

export default function AdminNews() {
  const [title, setTitle] = useState("");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadNews() {
    const res = await fetch("/api/news", { cache: "no-store" });
    const json = await res.json();
    setNews(json.news);
  }

  useEffect(() => { loadNews(); }, []);

  async function submit(e: any) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setLoading(false);
    setTitle("");

    if (res.ok) loadNews();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl text-white mb-8">Admin: Add News</h1>

      <form onSubmit={submit} className="space-y-4 bg-black/40 p-6 rounded-xl">
        <input
          type="text"
          className="w-full px-4 py-2 rounded bg-black/60 border border-white/20 text-white"
          placeholder="News title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 rounded bg-cyan-500 text-black hover:bg-cyan-400"
        >
          {loading ? "Adding..." : "Add News"}
        </button>
      </form>

      <h2 className="text-xl text-white mt-10 mb-4">Existing News</h2>

      <div className="space-y-3">
        {news.map((item: any) => (
          <div key={item._id} className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-white">{item.title}</p>
            <p className="text-white/40 text-xs">{new Date(item.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
