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

type BellButtonProps = {
  bellRef: React.RefObject<HTMLButtonElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  unreadCount: number;
  news: NewsItem[];
  handleViewAllClick: () => void;
};

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
    setPill({ left: rect.left - parentRect.left, width: rect.width, opacity: 1 });
  }, [pathname]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleViewAllClick() {
    localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
    setUnreadCount(0);
    setOpen(false);
  }

  return (
    <>
      {/* Ambient top glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] z-40"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
      />

      <nav
        className="w-full sticky top-0 z-50"
        style={{
          background: "rgba(0, 0, 0, 0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 2px 40px 0 rgba(0,0,0,0.5)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">

          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)", transform: "scale(1.8)" }}
              />
              <Image
                src="/icon.png"
                alt="NeuroBioMark Logo"
                width={80}
                height={80}
                className="h-10 w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>

            <span className="text-xl font-semibold tracking-wide select-none text-white whitespace-nowrap">
              NeuroBioMark
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden md:flex items-center gap-6">

            {/* Nav links container */}
            <div
              ref={navRef}
              className="relative flex items-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "9999px",
                padding: "4px",
                gap: "2px",
              }}
            >
              {/* Sliding pill */}
              <motion.div
                className="absolute inset-y-[4px] rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.07) 100%)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 0 12px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
                animate={{ x: pill.left, width: pill.width, opacity: pill.opacity }}
                transition={{ type: "spring", stiffness: 900, damping: 48, mass: 0.3 }}
              />

              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <motion.div key={link.name} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={link.href}
                      data-active={active}
                      className="relative z-10 flex items-center h-9 px-5 text-[0.8125rem] font-medium tracking-wide transition-colors duration-200"
                      style={{ color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)" }}
                      onMouseEnter={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                      }}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Subtle divider */}
            <div
              style={{
                width: "1px",
                height: "22px",
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)",
              }}
            />

            {/* Bell */}
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

          {/* ── MOBILE ACTIONS ── */}
          <div className="md:hidden flex items-center gap-3">
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
              className="p-2 rounded-xl text-white/60 hover:text-white transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
              style={{
                background: "rgba(6, 8, 16, 0.4)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex flex-col p-3 gap-1">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150"
                      style={{
                        background: active ? "rgba(100,160,255,0.1)" : "transparent",
                        border: active ? "1px solid rgba(100,160,255,0.2)" : "1px solid transparent",
                        color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

/* ── BELL COMPONENT ── */
function BellButton({
  bellRef,
  dropdownRef,
  open,
  setOpen,
  unreadCount,
  news,
  handleViewAllClick,
}: BellButtonProps) {
  return (
    <div className="relative">
      <motion.button
        ref={bellRef}
        onClick={() => setOpen((p: boolean) => !p)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-200"
        style={{
          background: open ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${open ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        <Bell className="w-4 h-4" style={{ color: "rgba(255,255,255,0.65)" }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full text-white text-[10px] flex items-center justify-center font-semibold"
            style={{
              background: "linear-gradient(135deg, #f87171, #dc2626)",
              boxShadow: "0 0 8px rgba(220,38,38,0.5)",
            }}
          >
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-72 rounded-2xl p-4 shadow-2xl z-50"
            style={{
              background: "rgba(10, 14, 26, 0.85)",
              backdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-semibold tracking-wide"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Latest News
              </h3>
              {unreadCount > 0 && (
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {news.length === 0 ? (
                <p className="text-xs py-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  No news yet.
                </p>
              ) : (
                news.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-xl transition-colors duration-150"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p className="text-sm leading-snug mb-1" style={{ color: "rgba(255,255,255,0.82)" }}>
                      {item.title}
                    </p>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div
              className="mt-3 pt-3 flex justify-end"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Link
                href="/news"
                onClick={handleViewAllClick}
                className="text-xs font-medium transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.45)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.9)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
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
