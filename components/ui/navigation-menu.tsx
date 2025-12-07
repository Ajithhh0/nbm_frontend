"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { name: "Home", href: "/" },
  { name: "Background", href: "/background" },
  { name: "Software", href: "/software" },
  { name: "Research", href: "/research" },
  { name: "Team", href: "/team" },
];

export default function NavigationMenu() {
  const pathname = usePathname();

  return (
    <nav
      className="
        w-full sticky top-0 z-50
        bg-black/10
        backdrop-blur-lg
        border-b border-white/5
        transition-colors 
      "
    >
      <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/NBMLogoNobg_cropped.png"   // ← FIXED
            alt="NBM Logo"
            width={95}
            height={50}
            className="object-contain"
          />
        </Link>

        {/* NAV LINKS WITH SLIDER */}
        <div className="relative flex gap-8">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <div key={link.name} className="relative">
                {active && (
                  <motion.div
                    layoutId="pill"
                    className="
                      absolute inset-0 rounded-full
                      bg-neutral-700
                    "
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}

                <Link
                  href={link.href}
                  className="
                    relative z-10 px-5 py-2
                    text-sm font-medium text-white/80
                    hover:text-white transition-colors
                  "
                >
                  {link.name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
