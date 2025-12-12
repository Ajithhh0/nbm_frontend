"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "Background", href: "/background" },
  { name: "Software", href: "/software" },
  { name: "Research", href: "/research" },
  { name: "Team", href: "/team" },
];

type NewsItem = {
  _id: string;
  title: string;
  createdAt: string;
};

const LAST_SEEN_KEY = "nbm_news_last_seen";

export default function NavigationMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const bellRef = useRef<HTMLButtonElement | null>(null);

  // Fetch news
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?limit=5", { cache: "no-store" });
        const data = await res.json();
        const items: NewsItem[] = data.news || [];

        setNews(items);

        if (items.length === 0) {
          setUnreadCount(0);
          return;
        }

        const lastSeen = localStorage.getItem(LAST_SEEN_KEY);

        if (!lastSeen) {
          setUnreadCount(items.length);
        } else {
          const lastSeenTime = new Date(lastSeen).getTime();
          const count = items.filter(
            (item) =>
              item.createdAt &&
              new Date(item.createdAt).getTime() > lastSeenTime
          ).length;
          setUnreadCount(count);
        }
      } catch (err) {
        console.error("Failed to load news", err);
      }
    }

    fetchNews();
  }, []);

  function toggleDropdown() {
    setOpen((prev) => !prev);
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!open) return;
      if (bellRef.current?.contains(e.target as Node)) return;
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleViewAllClick() {
    localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
    setUnreadCount(0);
    setOpen(false);
  }

  return (
    <nav className="w-full sticky top-0 z-50 bg-black/10 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/NBMLogoNobg_cropped.png"
            alt="NBM Logo"
            width={95}
            height={50}
            className="object-contain"
          />
        </Link>

        <div className="relative flex items-center gap-10">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <div key={link.name} className="relative">
                {active && (
                  <motion.div
                    layoutId="pill"
                    className="absolute inset-0 rounded-full bg-neutral-700"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <Link
                  href={link.href}
                  className="relative z-10 px-5 py-2 text-sm font-medium text-white/80 hover:text-white"
                >
                  {link.name}
                </Link>
              </div>
            );
          })}

          {/* BELL */}
          <div className="relative">
            <button
              ref={bellRef}
              onClick={toggleDropdown}
              className="relative p-2 rounded-full hover:bg-white/10"
            >
              <Bell className="w-6 h-6 text-white/80" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-72 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl z-50"
                >
                  <h3 className="text-white font-semibold mb-3">
                    Latest News
                  </h3>

                  <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                    {news.length === 0 ? (
                      <p className="text-white/50 text-sm">No news yet.</p>
                    ) : (
                      news.map((item) => (
                        <div
                          key={item._id}
                          className="p-2 rounded-lg bg-white/5"
                        >
                          <p className="text-white/90 text-sm">
                            {item.title}
                          </p>
                          <p className="text-white/40 text-xs">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString()
                              : "—"}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-white/10 mt-3 pt-3 text-right">
                    <Link
                      href="/news"
                      onClick={handleViewAllClick}
                      className="text-white/60 text-sm hover:text-white"
                    >
                      View all →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
