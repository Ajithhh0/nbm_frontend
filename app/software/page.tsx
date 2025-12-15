"use client";

export default function SoftwarePage() {
  return (
    <section className="min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-white">
          NeuroBiomark – Software Demo
        </h1>

        {/* Glass Card */}
        <div className="rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-lg shadow-xl p-4">
          
          {/* Video */}
          <video
            src="/demo/nbm_demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-xl border border-cyan-400/20"
          />

          {/* Caption */}
          <p className="mt-4 text-sm text-white/70">
            Live demonstration of the NeuroBiomark desktop diagnostic software.
          </p>
        </div>
      </div>
    </section>
  );
}
