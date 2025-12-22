"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type TimelineItem = {
  _id: string;
  title: string;
  date: string;
};

export default function HorizontalTimeline() {
  const [items, setItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    fetch("/api/timeline")
      .then(res => res.json())
      .then(setItems);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <h2 className="text-sm uppercase tracking-wide text-white/60 mb-4">
        Project Timeline
      </h2>

      <div className="relative flex items-center gap-10 overflow-x-auto pb-4">
        {/* Line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />

        {items.map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative z-10 flex flex-col items-center min-w-[80px]"
          >
            {/* Dot */}
            <span className="w-3 h-3 mt-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />

            {/* Year */}
            <span className="mt-2 text-xs text-white/60">
              {new Date(item.date).getFullYear()}
            </span>

            {/* Label */}
            <span className="mt-1 text-xs text-center text-white/80">
              {item.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
