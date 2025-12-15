"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Layers,
  FlaskConical,
  Scan,
  BarChart3,
  Brain,
  Image as ImageIcon,
  Activity,
} from "lucide-react";

/* -------------------- DATA -------------------- */
const accuracyData = [0.62, 0.71, 0.78, 0.82, 0.86];
const lossData = [1.3, 0.98, 0.72, 0.55, 0.43];

const tissueImages = [
  { src: "/research/10.jpg", label: "TDP-43, BA44 – Control" },
  { src: "/research/24.jpg", label: "TDP-43, BA46 – Discordant" },
  { src: "/research/104.jpg", label: "TDP-43, BA44 – Concordant" },
];

/* -------------------- PAGE -------------------- */
export default function ResearchPage() {
  const slides = [
    { id: "overview", view: <OverviewSlide /> },
    { id: "pipeline", view: <PipelineSlide /> },
    { id: "charts", view: <ChartsSlide /> },
    { id: "tissue", view: <TissueSlide /> },
    { id: "model", view: <ModelSlide /> },
  ];

  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slides[index].view}
        </motion.div>
      </AnimatePresence>

      <SlideControls
        index={index}
        total={slides.length}
        next={next}
        prev={prev}
      />
    </div>
  );
}

/* -------------------- CONTROLS -------------------- */
function SlideControls({
  index,
  total,
  next,
  prev,
}: {
  index: number;
  total: number;
  next: () => void;
  prev: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-50">
      <button
        onClick={prev}
        disabled={index === 0}
        className="text-xs text-white/70 hover:text-white disabled:opacity-30"
      >
        ← Previous
      </button>

      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-6 rounded-full transition ${
              i === index ? "bg-cyan-400" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      <button
        onClick={next}
        disabled={index === total - 1}
        className="text-xs text-white/70 hover:text-white disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}

/* -------------------- WRAPPER -------------------- */
function SectionWrapper({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="relative z-10 max-w-6xl w-full">{children}</div>
    </section>
  );
}

/* -------------------- SLIDES -------------------- */
function OverviewSlide() {
  return (
    <SectionWrapper>
      <div className="space-y-10 text-center">
        <h1 className="text-5xl font-bold text-white">Research Overview</h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          End-to-end visualization of the NeuroBioMark ALS histopathology pipeline.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Images" value="190" icon={<Database />} />
          <MetricCard title="Classes" value="3" icon={<Layers />} />
          <MetricCard title="Augmentations" value="15" icon={<FlaskConical />} />
          <MetricCard title="CV Folds" value="5" icon={<Scan />} />
        </div>
      </div>
    </SectionWrapper>
  );
}

function PipelineSlide() {
  return (
    <SectionWrapper>
      <SectionTitle icon={<Brain />} title="Research Pipeline" />
      <ResearchPipeline />
    </SectionWrapper>
  );
}

function ChartsSlide() {
  return (
    <SectionWrapper>
      <SectionTitle icon={<BarChart3 />} title="Model Performance" />
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <AnimatedLineChart title="Accuracy" data={accuracyData} />
        <AnimatedLineChart title="Loss" data={lossData} />
      </div>
    </SectionWrapper>
  );
}

/* -------------------- TISSUE SLIDE (WITH LIGHTBOX) -------------------- */
function TissueSlide() {
  const [active, setActive] = useState<number | null>(null);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <SectionWrapper>
      <SectionTitle icon={<ImageIcon />} title="TDP-43 Tissue Samples" />

      {/* GRID */}
      <div className="grid sm:grid-cols-3 gap-6 mt-8">
        {tissueImages.map((img, i) => (
          <motion.button
            key={img.src}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActive(i)}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden text-left"
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${img.src})` }}
            />
            <p className="text-xs text-white/80 p-2">{img.label}</p>
          </motion.button>
        ))}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <motion.div
              className="relative max-w-5xl w-[90%] rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-xl"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={tissueImages[active].src}
                alt={tissueImages[active].label}
                className="w-full max-h-[75vh] object-contain"
              />
              <div className="px-4 py-3 text-sm text-white/85">
                {tissueImages[active].label}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}

function ModelSlide() {
  return (
    <SectionWrapper>
      <SectionTitle icon={<Activity />} title="Model & Explainability" />
      <ModelPipelineViz />
    </SectionWrapper>
  );
}

/* -------------------- COMPONENTS -------------------- */
function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-cyan-400">{icon}</div>
        <div className="text-2xl text-white">{value}</div>
      </div>
      <p className="text-xs text-white/70 mt-2">{title}</p>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 text-white text-3xl font-semibold">
      <span className="text-cyan-400">{icon}</span>
      {title}
    </div>
  );
}

function ResearchPipeline() {
  const steps = [
    "Dataset",
    "Augmentation",
    "Preprocessing",
    "Model",
    "Explainability",
    "Results",
  ];

  return (
    <div className="relative mt-14">
      <div className="absolute top-6 left-0 right-0 h-px bg-white/20" />
      <motion.div
        className="absolute top-[22px] h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)]"
        initial={{ left: "0%" }}
        animate={{ left: "100%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative flex justify-between">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full border border-cyan-400 bg-white/10 backdrop-blur-xl flex items-center justify-center text-white">
              {i + 1}
            </div>
            <p className="text-xs text-white/80 text-center">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimatedLineChart({
  title,
  data,
}: {
  title: string;
  data: number[];
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / (max - min)) * 80 - 10;
    return `${x},${y}`;
  });

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
      <h3 className="text-sm text-white mb-2">{title}</h3>
      <svg viewBox="0 0 100 100" className="w-full h-40">
        <motion.polyline
          points={points.join(" ")}
          fill="none"
          stroke="rgb(34,211,238)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />
      </svg>
    </div>
  );
}

function ModelPipelineViz() {
  const stages = [
    "Input Tile",
    "Feature Extractor",
    "Attention",
    "Classifier",
    "Output",
  ];

  return (
    <div className="flex justify-between mt-10">
      {stages.map((s) => (
        <div
          key={s}
          className="w-32 h-16 border border-cyan-400 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center text-xs text-white"
        >
          {s}
        </div>
      ))}
    </div>
  );
}
