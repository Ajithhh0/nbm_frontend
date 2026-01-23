"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";

export default function SoftwarePage() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");

  const [captchaToken, setCaptchaToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!captchaToken) return;

    setLoading(true);
    setError(null);

    const res = await fetch("/api/request-demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        purpose,
        captchaToken,
      }),
    });
     
     const data = await res.json();
     setLoading(false);


 if (!res.ok) {
    if (res.status === 429) {
      setError(
        "You’ve already requested a demo recently. Please try again later."
      );
    } else {
      setError(data.error || "Something went wrong. Please try again.");
    }
    return;
  }

  setSuccess(true);
  setName("");
  setEmail("");
  setPurpose("");
  setCaptchaToken("");

    setTimeout(() => {
    setOpen(false);
    setSuccess(false);
  }, 2000);
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
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-xl"
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
                  <svg className="w-20 h-20 mb-6" viewBox="0 0 52 52">
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                      stroke="rgb(34 211 238)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6 }}
                    />
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

                  <h3 className="text-lg font-semibold text-white">
                    Demo request sent successfully
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    One of us will be in touch soon
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    required
                    minLength={2}
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

                  <textarea
                    required
                    minLength={30}
                    rows={4}
                    placeholder="Please describe your purpose in detail for requesting a demo (research, clinical use, collaboration, etc.)"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2 text-white resize-none"
                  />

                  {/* CAPTCHA */}
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    options={{
                      theme: 'dark',
                      size: 'normal',
                      appearance: 'always',
                    }}
                    onSuccess={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken("")}
                  />

                  {/* Error / Spam Warning */}
                  {error && (
                   <div className="rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-200">
                   ⚠️ {error}
                   </div>
                   )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="text-white/70 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      disabled={loading || !captchaToken}
                      className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition disabled:opacity-50"
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
