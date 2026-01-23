"use client";

import { useEffect, useRef, useState } from "react";

/* ===================== TYPES ===================== */

type Status = "new" | "contacted" | "responded";

type DemoRequest = {
  _id: string;
  name: string;
  email: string;
  ip: string;
  createdAt: string;
  status: Status;
  notes?: string;
};

type ApiResponse = {
  items: DemoRequest[];
  pages: number;
};

/* ===================== STATUS BADGES ===================== */

const statusStyles: Record<Status, string> = {
  new: "bg-yellow-400/20 text-yellow-300",
  contacted: "bg-blue-400/20 text-blue-300",
  responded: "bg-green-400/20 text-green-300",
};

/* ===================== PAGE ===================== */

export default function RequestsPage() {
  const [data, setData] = useState<DemoRequest[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"" | Status>("");
  const [loading, setLoading] = useState(false);

  /* 🔹 BULK SELECTION */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // cache key = page|search|status
  const cacheRef = useRef<Map<string, ApiResponse>>(new Map());

  /* ===================== DEBOUNCE SEARCH ===================== */

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  /* ===================== CLEAR CACHE ON FILTER CHANGE ===================== */

useEffect(() => {
  const t = setTimeout(() => {
    setDebouncedSearch(search);
    setPage(1);
    setSelectedIds([]);        // ✅ allowed here
    cacheRef.current.clear();
  }, 300);

  return () => clearTimeout(t);
}, [search]);

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    const key = `${page}|${debouncedSearch}|${status}`;

    if (cacheRef.current.has(key)) {
      const cached = cacheRef.current.get(key)!;
      setData(cached.items);
      setPages(cached.pages);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function load() {
      const url =
        `/api/request-demo/list?page=${page}` +
        `&search=${encodeURIComponent(debouncedSearch)}` +
        `&status=${encodeURIComponent(status)}`;

      const res = await fetch(url);
      const json: ApiResponse = await res.json();

      if (!cancelled) {
        setData(json.items || []);
        setPages(json.pages || 1);
        cacheRef.current.set(key, json);
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, status]);

  /* ===================== SELECTION HELPERS ===================== */

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  function toggleSelectAll() {
    const pageIds = data.map((r) => r._id);
    const allSelected = pageIds.every((id) =>
      selectedIds.includes(id)
    );
    setSelectedIds(allSelected ? [] : pageIds);
  }

  /* ===================== ACTIONS ===================== */

  async function updateStatus(id: string, status: Status) {
    await fetch(`/api/request-demo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setData((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status } : r))
    );
  }

  async function saveNotes(id: string, notes: string) {
    await fetch(`/api/request-demo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
  }

  async function deleteRequest(id: string) {
    const ok = confirm("Delete this demo request?");
    if (!ok) return;

    await fetch(`/api/request-demo/${id}`, {
      method: "DELETE",
    });

    setData((prev) => prev.filter((r) => r._id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  async function bulkDelete() {
    if (selectedIds.length === 0) return;

    const ok = confirm(
      `Delete ${selectedIds.length} selected requests?`
    );
    if (!ok) return;

    await fetch("/api/request-demo/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    });

    setData((prev) =>
      prev.filter((r) => !selectedIds.includes(r._id))
    );
    setSelectedIds([]);
  }

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-slate-900 to-black text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">
        Demo Requests
      </h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <input
          placeholder="Search name or email"
          className="bg-black/40 border border-white/20 rounded-lg px-4 py-2 w-64 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as Status | "");
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="responded">Responded</option>
        </select>

        {selectedIds.length > 0 && (
          <button
            onClick={bulkDelete}
            className="ml-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}

        <a
          href="/api/request-demo/export"
          className="ml-auto px-4 py-2 rounded-lg border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 transition"
        >
          Export CSV
        </a>
      </div>

      {/* Loading / Empty */}
      {loading && (
        <div className="py-10 text-center text-gray-400">
          Loading requests…
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="py-10 text-center text-gray-400">
          No requests found
        </div>
      )}

      {/* Table */}
      {!loading && data.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur">
          <table className="w-full text-sm">
            <thead className="bg-white/10 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={
                      data.length > 0 &&
                      data.every((r) =>
                        selectedIds.includes(r._id)
                      )
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((r) => (
                <tr
                  key={r._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(r._id)}
                      onChange={() => toggleSelect(r._id)}
                    />
                  </td>

                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {r.email}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-300">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-gray-400">
                    {r.ip}
                  </td>

                  <td className="px-4 py-3 w-72">
                    <textarea
                      className="w-full bg-black/40 border border-white/20 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      defaultValue={r.notes || ""}
                      placeholder="Internal notes…"
                      onBlur={(e) =>
                        saveNotes(r._id, e.target.value)
                      }
                    />
                  </td>

                  <td className="px-4 py-3 text-center space-y-2">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        updateStatus(
                          r._id,
                          e.target.value as Status
                        )
                      }
                      className="bg-black/40 border border-white/20 rounded-md px-2 py-1 text-white text-xs"
                    >
                      <option value="new">New</option>
                      <option value="contacted">
                        Contacted
                      </option>
                      <option value="responded">
                        Responded
                      </option>
                    </select>

                    <button
                      onClick={() => deleteRequest(r._id)}
                      className="block mx-auto text-red-400 hover:text-red-300 text-xs underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 text-gray-300">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded border border-white/20 disabled:opacity-40 hover:bg-white/10"
          >
            Prev
          </button>

          <span>
            Page {page} / {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded border border-white/20 disabled:opacity-40 hover:bg-white/10"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
