type NewsItem = {
  _id: string;
  title: string;
  date: string;
};

async function fetchNews(): Promise<NewsItem[]> {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"; 

  const res = await fetch(`${base}/api/news`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  const json = await res.json();
  return json.news;
}

export default async function NewsPage() {
  const news = await fetchNews();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-white mb-6">Project News</h1>

      {news.length === 0 && (
        <p className="text-white/60 text-sm">No news available yet.</p>
      )}

      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item._id}
            className="border border-white/10 rounded-xl p-4 bg-white/5"
          >
            <p className="text-white text-lg">{item.title}</p>
            <p className="text-white/40 text-xs">
              {new Date(item.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
