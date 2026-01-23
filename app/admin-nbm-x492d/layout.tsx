"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Clock,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin-nbm-x492d",
    icon: LayoutDashboard,
  },
  {
    label: "Requests",
    href: "/admin-nbm-x492d/requests",
    icon: FileText,
  },
  {
    label: "News",
    href: "/admin-nbm-x492d/news",
    icon: Newspaper,
  },
  {
    label: "Timeline",
    href: "/admin-nbm-x492d/timeline",
    icon: Clock,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="relative z-10 flex h-[calc(100vh-80px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-4">
        <div className="mb-6 text-lg font-semibold text-white/90">
          Admin
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                  ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-2 border-t border-white/10" />

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
