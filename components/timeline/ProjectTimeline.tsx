"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Item = {
  _id: string;
  title: string;
  description: string;
  date: string;
};

export default function ProjectTimeline() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/timeline")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <aside className="relative">
      <h2 className="text-lg font-semibold mb-6">Project Timeline</h2>

      <div className="relative border-l border-cyan-400/30 pl-6 space-y-8">
        {items.map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative"
          >
            {/* Dot */}
            <span className="absolute -left-[34px] top-1 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />

            <p className="text-xs text-white/50">
              {new Date(item.date).toDateString()}
            </p>
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-white/70">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
