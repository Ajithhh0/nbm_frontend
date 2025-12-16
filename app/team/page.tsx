"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Mail,
  Linkedin,
  X,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const team = [
  {
    name: "Dr Marta Vallejo",
    role: "Associate Professor",
    img: "/team/MV.jpg",
    linkedin: "https://www.linkedin.com/in/marta-vallejo-hwu/",
    email: "m.vallejo@hw.ac.uk",
  },
  {
    name: "Jemimah Maria Kuruvilla",
    role: "Research Assistant",
    img: "/team/Jemima.jpg",
    linkedin: "https://www.linkedin.com/in/jemimah-maria-kuruvilla-b33401209/",
    email: "jmk4001@hw.ac.uk",
  },
  {
    name: "Lukas",
    role: "Machine Learning Engineer",
    img: "/team/Lukas.jpeg",
    linkedin: "https://www.linkedin.com/in/lukas-jurcaga-4b961738b/",
    email: "lj2003@hw.ac.uk",
  },
  {
    name: "Ajith Nair",
    role: "Research Assistant",
    img: "/team/Ajith-1.jpeg",
    linkedin: "https://www.linkedin.com/in/ajith-nair-765662215/",
    email: "Ajith.Nair@hw.ac.uk",
  },
];

export default function TeamPage() {
  const [popover, setPopover] = useState<{
    email: string;
    anchor: DOMRect;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  /* Close popover on outside click or ESC */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setPopover(null);
        setCopied(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPopover(null);
        setCopied(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleCopy = async (email: string) => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-24 pb-32 px-4 text-white">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-2"
      >
        Our Team
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-white/70 text-center max-w-2xl mb-16"
      >
        Meet the dedicated individuals behind our project, combining expertise in AI, healthcare, and technology to drive innovation and excellence.
      </motion.p>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl hover:shadow-cyan-500/20 transition"
          >
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28 rounded-full border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)] overflow-hidden">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <h2 className="text-center text-xl font-semibold">
              {member.name}
            </h2>

            <h3 className="text-center text-cyan-300 text-sm font-medium mt-1">
              {member.role}
            </h3>

            {/* SOCIAL ICONS */}
            <div className="flex justify-center gap-4 mt-5">
              <a
                href={member.linkedin}
                target="_blank"
                className="p-2 rounded-full bg-white/5 hover:bg-white/20 border border-white/20 transition"
              >
                <Linkedin size={20} />
              </a>

              <button
                onClick={(e) => {
                  const rect =
                    e.currentTarget.getBoundingClientRect();
                  setPopover({
                    email: member.email,
                    anchor: rect,
                  });
                }}
                className="p-2 rounded-full bg-white/5 hover:bg-white/20 border border-white/20 transition"
              >
                <Mail size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EMAIL POPOVER */}
      <AnimatePresence>
        {popover && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: popover.anchor.bottom + 8,
              left: popover.anchor.left - 140,
            }}
            className="z-50 w-72 rounded-xl bg-[#0b0f1a] border border-white/20 shadow-xl p-4 backdrop-blur-xl"
          >
            <button
              onClick={() => setPopover(null)}
              className="absolute top-2 right-2 text-white/60 hover:text-white"
            >
              <X size={16} />
            </button>

            <h4 className="text-sm font-semibold mb-2">
              Contact Email
            </h4>

            <p className="text-cyan-300 text-sm break-all select-all mb-4">
              {popover.email}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(popover.email)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>

              <a
                href={`mailto:${popover.email}`}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition"
              >
                <ExternalLink size={16} />
                Open
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
