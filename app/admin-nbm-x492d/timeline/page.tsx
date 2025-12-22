"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type TimelineItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
};

export default function TimelineAdminPage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [error, setError] = useState("");

  /* ================= LOAD ================= */
  useEffect(() => {
    const fetchTimeline = async () => {
      const res = await fetch("/api/timeline");
      const data = await res.json();
      setItems(data);
    };
    fetchTimeline();
  }, []);

  /* ================= CREATE ================= */
  async function addTimelineItem() {
    setError("");

    if (!title || !date) {
      setError("Title and date are required.");
      return;
    }

    await fetch("/api/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        date,
      }),
    });

    setTitle("");
    setDescription("");
    setDate(null);

    const res = await fetch("/api/timeline");
    setItems(await res.json());
  }

  /* ================= DELETE ================= */
  async function deleteItem(id: string) {
    await fetch("/api/timeline", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const res = await fetch("/api/timeline");
    setItems(await res.json());
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 text-white">
      <h1 className="text-3xl font-semibold mb-8">Timeline Admin</h1>

      {/* ================= CREATE ================= */}
      <div className="border border-white/10 rounded-xl p-6 bg-white/5 mb-12">
        <h2 className="font-medium mb-4">Add Timeline Milestone</h2>

        <input
          className="w-full mb-3 px-3 py-2 rounded bg-black/60 border border-white/20"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full mb-3 px-3 py-2 rounded bg-black/60 border border-white/20"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

    
        {/* DATE PICKER — FIXED LAYOUT */}
       <div className="relative mb-3 h-[50px]">
  <DatePicker
    selected={date}
    onChange={(d: Date | null) => setDate(d)}
    dateFormat="dd/MM/yyyy"
    placeholderText="DD/MM/YYYY"
    popperPlacement="bottom-start"
    className="w-full px-3 py-2 rounded bg-black/60 border border-white/20 text-white"
  />
</div>



        {error && (
          <p className="text-sm text-red-400 mb-3">{error}</p>
        )}

        <button
          onClick={addTimelineItem}
          className="px-4 py-2 rounded bg-cyan-500 text-black font-medium"
        >
          Add Milestone
        </button>
      </div>

      {/* ================= EXISTING ================= */}
      <div>
        <h2 className="font-medium mb-4">Existing Timeline</h2>

        {items.length === 0 && (
          <p className="text-sm text-white/50">No timeline entries yet.</p>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border border-white/10 rounded p-4 bg-white/5"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-white/50">
                  {new Date(item.date).toLocaleDateString("en-GB")}
                </p>
              </div>

              <button
                onClick={() => deleteItem(item._id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
