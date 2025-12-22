"use client";

import { Mail, Youtube, Facebook, Instagram, Linkedin, X } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* LEFT */}
        <p className="text-white/60 text-sm text-center md:text-left">
          © {new Date().getFullYear()} NeuroBioMark. All rights reserved.
        </p>

       {/* CENTER – CONTACT (TEXT BUTTON) */}
<a
  href="/contact"
  className="
    text-white/80 
    text-sm 
    font-medium
    flex items-center gap-2
    hover:text-white 
    transition
    group
  "
>
  <Mail size={16} className="opacity-70 group-hover:opacity-100 transition" />
  Contact Us
</a>

        {/* RIGHT – SOCIALS */}
        <div className="flex gap-5 text-white/70">
          <a href="#" aria-label="YouTube" className="hover:text-white transition">
            <Youtube size={20} />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-white transition">
            <Facebook size={20} />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-white transition">
            <Instagram size={20} />
          </a>
          <a href="#" aria-label="X" className="hover:text-white transition">
            <X size={20} />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
            <Linkedin size={20} />
          </a>
        </div>

      </div>
    </footer>
  );
}
