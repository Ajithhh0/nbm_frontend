import { headers } from "next/headers";

async function getStats() {
  const h = await headers();
  const host = h.get("host");
   if (!host) {
    throw new Error("Host header not found");
  }

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/request-demo/stats`,
    { cache: "no-store" }
  );

   if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }


  return res.json();
}

function MiniChart({
  data,
}: {
  data: { _id: string; count: number }[];
}) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex gap-2 items-end h-32">
      {data.map((d) => (
        <div
          key={d._id}
          title={`${d._id}: ${d.count}`}
          style={{ height: `${(d.count / max) * 100}%` }}
          className="w-6 rounded bg-blue-500"
        />
      ))}
    </div>
  );
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">
        Admin Dashboard
      </h1>

      {/* Navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/admin-nbm-x492d/requests"
          className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 hover:bg-black/50 transition"
        >
          <h3 className="font-semibold text-white mb-1">
            Demo Requests
          </h3>
          <p className="text-white/70 text-sm">
            View and manage demo enquiries
          </p>
        </a>

        <a
          href="/admin-nbm-x492d/news"
          className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 hover:bg-black/50 transition"
        >
          <h3 className="font-semibold text-white mb-1">
            News
          </h3>
          <p className="text-white/70 text-sm">
            Create and edit news posts
          </p>
        </a>

        <a
          href="/admin-nbm-x492d/timeline"
          className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 hover:bg-black/50 transition"
        >
          <h3 className="font-semibold text-white mb-1">
            Timeline
          </h3>
          <p className="text-white/70 text-sm">
            Manage research timeline entries
          </p>
        </a>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Demo Requests per Day
        </h2>
        <MiniChart data={stats} />
      </div>
    </div>
  );
}
