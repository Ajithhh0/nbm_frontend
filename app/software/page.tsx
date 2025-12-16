"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SoftwarePage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/request-demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setName("");
      setEmail("");

      setTimeout(() => {
      setOpen(false);
      setSuccess(false);
      }, 2000);
    }
  }

  return (
    <section className="min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-6 text-white">
          NeuroBiomark – Software Demo
        </h1>

        {/* Glass Card */}
        <div className="rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-lg shadow-xl p-4">
          <video
            src="/demo/nbm_demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-xl border border-cyan-400/20"
          />

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-white/70">
              Live demonstration of the NeuroBiomark desktop diagnostic software.
            </p>

            <button
              onClick={() => setOpen(true)}
              className="px-5 py-2 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black font-medium transition"
            >
              Request a Demo
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={() => setOpen(false)}   
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-cyan-400/30 p-6"
      >
        {/*  Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-xl"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">
          Request a Demo
        </h2>

        {success ? (
        <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
  className="flex flex-col items-center justify-center py-8 text-center"
>
  {/* Animated Circle + Tick */}
  <svg
    className="w-20 h-20 mb-6"
    viewBox="0 0 52 52"
  >
    {/* Circle */}
    <motion.circle
      cx="26"
      cy="26"
      r="25"
      fill="none"
      stroke="rgb(34 211 238)" // cyan-400
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    />

    {/* Tick */}
    <motion.path
      d="M14 27 L23 36 L38 18"
      fill="none"
      stroke="rgb(34 211 238)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    />
  </svg>

  {/* Text */}
  <motion.h3
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="text-lg font-semibold text-white"
  >
    Demo request sent successfully
  </motion.h3>

  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.8 }}
    className="mt-2 text-sm text-white/70"
  >
    One of us will be in touch soon
  </motion.p>
</motion.div>

        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2 text-white"
            />

            <input
              required
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2 text-white"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </section>
  );
}
