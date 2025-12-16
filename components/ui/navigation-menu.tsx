"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Bell, Menu, X } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const bellRef = useRef<HTMLButtonElement | null>(null);

  /* ---------- NAV PILL (DESKTOP ONLY) ---------- */
  const navRef = useRef<HTMLDivElement | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

  useLayoutEffect(() => {
    if (window.innerWidth < 768) return;

    const container = navRef.current;
    if (!container) return;

    const activeLink = container.querySelector(
      `[data-active="true"]`
    ) as HTMLElement | null;

    if (!activeLink) return;

    const parentRect = container.getBoundingClientRect();
    const rect = activeLink.getBoundingClientRect();

    setPill({
      left: rect.left - parentRect.left,
      width: rect.width,
      opacity: 1,
    });
  }, [pathname]);
  /* ------------------------------------------- */

  /* ---------- FETCH NEWS ---------- */
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?limit=5", { cache: "no-store" });
        const data = await res.json();
        const items: NewsItem[] = data.news || [];

        setNews(items);

        const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
        if (!lastSeen) {
          setUnreadCount(items.length);
        } else {
          const lastSeenTime = new Date(lastSeen).getTime();
          setUnreadCount(
            items.filter(
              (item) =>
                item.createdAt &&
                new Date(item.createdAt).getTime() > lastSeenTime
            ).length
          );
        }
      } catch (err) {
        console.error("Failed to load news", err);
      }
    }

    fetchNews();
  }, []);

  /* ---------- OUTSIDE CLICK (BELL) ---------- */
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
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
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

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          <div ref={navRef} className="relative flex items-center gap-2">
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-10 rounded-full bg-white/10"
              animate={{
                x: pill.left,
                width: pill.width,
                opacity: pill.opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 850,
                damping: 42,
                mass: 0.35,
              }}
            />

            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <motion.div key={link.name} whileHover={{ scale: 1.06 }}>
                  <Link
                    href={link.href}
                    data-active={active}
                    className={`relative z-10 px-5 py-2 text-sm font-medium ${
                      active
                        ? "text-white"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* BELL */}
          <BellButton
            bellRef={bellRef}
            dropdownRef={dropdownRef}
            open={open}
            setOpen={setOpen}
            unreadCount={unreadCount}
            news={news}
            handleViewAllClick={handleViewAllClick}
          />
        </div>

        {/* MOBILE ACTIONS */}
        <div className="md:hidden flex items-center gap-4">
          <BellButton
            bellRef={bellRef}
            dropdownRef={dropdownRef}
            open={open}
            setOpen={setOpen}
            unreadCount={unreadCount}
            news={news}
            handleViewAllClick={handleViewAllClick}
          />

          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="p-2 rounded-lg hover:bg-white/10 text-white"
          >
            {mobileOpen ? <X className="text-white" /> : <Menu className="text-white" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10"
          >
            <div className="flex flex-col p-4 gap-2">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm ${
                    pathname === link.href
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ---------- BELL COMPONENT ---------- */
function BellButton({
  bellRef,
  dropdownRef,
  open,
  setOpen,
  unreadCount,
  news,
  handleViewAllClick,
}: any) {
  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={() => setOpen((p: boolean) => !p)}
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
            <h3 className="text-white font-semibold mb-3">Latest News</h3>

            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
              {news.length === 0 ? (
                <p className="text-white/50 text-sm">No news yet.</p>
              ) : (
                news.map((item: any) => (
                  <div key={item._id} className="p-2 rounded-lg bg-white/5">
                    <p className="text-white/90 text-sm">{item.title}</p>
                    <p className="text-white/40 text-xs">
                      {new Date(item.createdAt).toLocaleString()}
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
  );
}
