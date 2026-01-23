"use client";

import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">

        {/* LEFT */}
        <div className="text-center md:text-left">
          <p className="text-white/80">
            © {new Date().getFullYear()} NeuroBioMark
          </p>
          <p className="text-white/50">
            Advancing healthcare through AI research
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <Mail size={16} className="opacity-70" />
          <span>info@neurobiomark.co.uk</span>
        </div>

      </div>
    </footer>
  );
}
