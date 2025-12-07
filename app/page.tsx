export default function Home() {
  return (
    <main className="relative z-10 flex flex-col items-center text-center px-6 pt-32">

      {/* HERO SECTION */}
      <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-fade-in">
        NeuroBioMark
      </h1>

      <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl animate-fade-in delay-200">
        Advanced AI-driven biomarkers for neurodegenerative disease
        detection, research, and clinical support.
      </p>

      {/* BUTTONS */}
      <div className="mt-8 flex gap-4 animate-fade-in delay-300">
        <a
          href="/background"
          className="px-6 py-3 rounded-lg bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition"
        >
          Learn More
        </a>

        <a
          href="/research"
          className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Explore Research
        </a>
      </div>

      {/* SECTION CARDS */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full animate-fade-in delay-500">

        {/* CARD 1 */}
        <a
          href="/background"
          className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition"
        >
          <h2 className="text-2xl font-semibold text-white">Background</h2>
          <p className="mt-2 text-white/70">
            Learn the science behind neurological biomarkers and their clinical importance.
          </p>
        </a>

        {/* CARD 2 */}
        <a
          href="/research"
          className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition"
        >
          <h2 className="text-2xl font-semibold text-white">Research</h2>
          <p className="mt-2 text-white/70">
            Explore AI research, model development, visual explanations, and publications.
          </p>
        </a>

        {/* CARD 3 */}
        <a
          href="/software"
          className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition"
        >
          <h2 className="text-2xl font-semibold text-white">Software Tools</h2>
          <p className="mt-2 text-white/70">
            Access the NeuroBioMark applications, analysis tools, and interactive demos.
          </p>
        </a>

      </div>
    </main>
  );
}
