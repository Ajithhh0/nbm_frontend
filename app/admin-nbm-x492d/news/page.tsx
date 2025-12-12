"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type NewsItem = {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
};

const CATEGORIES = [
  { value: "update", label: "Update" },
  { value: "research", label: "Research" },
  { value: "release", label: "Release" },
  { value: "announcement", label: "Announcement" },
];

export default function NewsAdminPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  // CREATE
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("update");
  const [newContent, setNewContent] = useState("");

  // EDIT
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("update");
  const [editContent, setEditContent] = useState("");

  /* =========================
     LOAD NEWS (OPTION 1)
     ========================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/news?limit=50", {
          cache: "no-store",
        });
        const json = await res.json();
        setNews(json.news || []);
      } catch (err) {
        console.error("Failed to load news", err);
      }
    })();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setLoading(true);
    await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        category: newCategory,
        content: newContent,
      }),
    });
    setLoading(false);

    setNewTitle("");
    setNewCategory("update");
    setNewContent("");

    // reload
    const res = await fetch("/api/news?limit=50", { cache: "no-store" });
    const json = await res.json();
    setNews(json.news || []);
  }

  function startEdit(item: NewsItem) {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditContent(item.content);
  }

  async function handleUpdate(id: string) {
    if (!editTitle.trim() || !editContent.trim()) return;

    setLoading(true);
    await fetch("/api/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title: editTitle,
        category: editCategory,
        content: editContent,
      }),
    });
    setLoading(false);

    setEditId(null);

    const res = await fetch("/api/news?limit=50", { cache: "no-store" });
    const json = await res.json();
    setNews(json.news || []);
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Delete this news item?");
    if (!ok) return;

    setLoading(true);
    await fetch("/api/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLoading(false);

    const res = await fetch("/api/news?limit=50", { cache: "no-store" });
    const json = await res.json();
    setNews(json.news || []);
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 text-white">
      <h1 className="text-3xl font-bold mb-6">News Admin Panel</h1>

      {/* CREATE */}
      <section className="mb-12 border border-white/10 rounded-xl p-6 bg-black/40">
        <h2 className="text-xl font-semibold mb-4">Create News</h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              className="w-full px-3 py-2 rounded bg-black/60 border border-white/20"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. New ALS dataset integrated"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              className="w-full px-3 py-2 rounded bg-black/60 border border-white/20"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">
                Content (Markdown)
              </label>
              <textarea
                className="w-full h-40 px-3 py-2 rounded bg-black/60 border border-white/20"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="**Bold**, [link](url), ![img](url)"
              />
            </div>

            <div>
              <p className="text-sm mb-1 text-white/60">Preview</p>
              <div className="w-full h-40 px-3 py-2 rounded bg-black/30 border border-white/10 overflow-auto text-sm prose prose-invert max-w-none">
                {newContent ? (
                  <ReactMarkdown>{newContent}</ReactMarkdown>
                ) : (
                  <span className="text-white/40">
                    Start typing to preview…
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add News"}
          </button>
        </form>
      </section>

      {/* LIST */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Existing News</h2>

        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item._id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              {editId === item._id ? (
                <div className="space-y-3">
                  <input
                    className="w-full px-3 py-2 rounded bg-black/60 border border-white/20"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <select
                    className="w-full px-3 py-2 rounded bg-black/60 border border-white/20"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  <div className="grid md:grid-cols-2 gap-4">
                    <textarea
                      className="w-full h-32 px-3 py-2 rounded bg-black/60 border border-white/20"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="w-full h-32 px-3 py-2 rounded bg-black/30 border border-white/10 overflow-auto text-sm prose prose-invert max-w-none">
                      <ReactMarkdown>{editContent}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate(item._id)}
                      className="px-3 py-1 rounded bg-green-500 text-black"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1 rounded bg-gray-500 text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium">{item.title}</p>
                  <p className="text-xs text-white/40">
                    {new Date(item.createdAt).toLocaleString()} ·{" "}
                    {
                      CATEGORIES.find(
                        (c) => c.value === item.category
                      )?.label
                    }
                  </p>

                  <div className="mt-3 text-sm text-white/80 line-clamp-3">
                    <ReactMarkdown>{item.content}</ReactMarkdown>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => startEdit(item)}
                      className="px-3 py-1 rounded bg-yellow-400 text-black"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {news.length === 0 && (
            <p className="text-white/50 text-sm">No news yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
