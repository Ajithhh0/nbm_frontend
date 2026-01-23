"use client";

import { useEffect, useState, ReactNode, useCallback } from "react";
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

/* -------------------- SHARED COMPONENTS -------------------- */

function SectionWrapper({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-6xl w-full">{children}</div>
    </section>
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

/* -------------------- SLIDES -------------------- */

function OverviewSlide() {
  return (
    <SectionWrapper>
      <div className="space-y-10 text-center">
        <h1 className="text-5xl font-bold text-white">Research Overview</h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          End-to-end visualization of the NeuroBiomark ALS histopathology pipeline.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="w-full max-w-5xl mx-auto">
        <SectionTitle icon={<Brain />} title="Research Pipeline" />

        <div className="mt-20">
          <ResearchPipeline />
        </div>
      </div>
    </SectionWrapper>
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
    <div className="relative">
      {/* line */}
      <div className="absolute top-6 left-0 right-0 h-px bg-white/20" />

      {/* animated dot */}
      <motion.div
        className="absolute top-[18px] h-3 w-3 rounded-full bg-cyan-400
                   shadow-[0_0_14px_rgba(34,211,238,0.9)]"
        initial={{ left: "0%" }}
        animate={{ left: "100%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* steps */}
      <div
        className="
          relative
          grid
          grid-cols-6
          gap-8
          text-center
        "
      >
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-3">
            <div
              className="
                h-12 w-12
                rounded-full
                border border-cyan-400
                bg-white/10 backdrop-blur-xl
                flex items-center justify-center
                text-white text-sm
              "
            >
              {i + 1}
            </div>
            <p className="text-xs text-white/80">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}



function ChartsSlide() {
  return (
    <SectionWrapper>
      <SectionTitle icon={<BarChart3 />} title="Model Performance" />

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <LineChart title="Accuracy" data={accuracyData} />
        <LineChart title="Loss" data={lossData} />
      </div>
    </SectionWrapper>
  );
}
function LineChart({
  title,
  data,
}: {
  title: string;
  data: number[];
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);

  // Convert data → SVG points
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / (max - min)) * 70 - 15;
    return `${x},${y}`;
  });

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
      <h3 className="text-sm text-white mb-3">{title}</h3>

      <svg viewBox="0 0 100 100" className="w-full h-40">
        {/* grid */}
        <line x1="0" y1="90" x2="100" y2="90" stroke="rgba(255,255,255,0.1)" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" />

        {/* animated line */}
        <motion.polyline
          points={points.join(" ")}
          fill="none"
          stroke="rgb(34,211,238)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* dots */}
        {points.map((p, i) => {
          const [x, y] = p.split(",");
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.8"
              fill="rgb(34,211,238)"
            />
          );
        })}
      </svg>
    </div>
  );
}



// function TissueSlide() {
//   return (
//     <SectionWrapper>
//       <SectionTitle icon={<ImageIcon />} title="TDP-43 Tissue Samples" />
//       <div className="grid sm:grid-cols-3 gap-6 mt-10">
//         {tissueImages.map((img) => (
//           <div
//             key={img.src}
//             className="border border-white/20 rounded-xl overflow-hidden bg-white/10"
//           >
//             <img src={img.src} alt={img.label} />
//             <p className="text-xs text-white/70 p-2">{img.label}</p>
//           </div>
//         ))}
//       </div>
//     </SectionWrapper>
//   );
// }

function ModelSlide() {
  return (
    <SectionWrapper>
      <div className="w-full max-w-5xl mx-auto">
        <SectionTitle icon={<Activity />} title="Model & Explainability" />

        <div className="mt-20">
          <ModelPipelineViz />
        </div>
      </div>
    </SectionWrapper>
  );
}

function ModelPipelineViz() {
  const stages = [
    "Input Tiles",
    "CNN Backbone",
    "Attention",
    "Classifier",
    "Prediction",
  ];

  return (
    <div className="relative">
      {/* connection line */}
      <div className="absolute top-8 left-0 right-0 h-px bg-white/20" />

      <div className="grid grid-cols-5 gap-8 text-center">
        {stages.map((stage) => (
          <div
            key={stage}
            className="flex flex-col items-center gap-4"
          >
            <div
              className="
                w-28 h-14
                rounded-xl
                border border-cyan-400
                bg-white/10 backdrop-blur-xl
                flex items-center justify-center
                text-xs text-white
              "
            >
              {stage}
            </div>
          </div>
        ))}
      </div>

      {/* explainability callout */}
      <div className="mt-16 flex justify-center">
        <div
          className="
            px-6 py-3
            rounded-xl
            border border-cyan-400
            bg-cyan-400/10
            text-cyan-300
            text-sm
          "
        >
          Explainability via Grad-CAM / Attention Maps
        </div>
      </div>
    </div>
  );
}


/* -------------------- PAGE -------------------- */

export default function ResearchPage() {
 const slides = [
  <OverviewSlide key="overview" />,
  <PipelineSlide key="pipeline" />,
  <ChartsSlide key="charts" />,
  //<TissueSlide key="tissue" />,
  <ModelSlide key="model" />,
];


  const [index, setIndex] = useState(0);

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, slides.length - 1)),
    [slides.length]
  );

  const prev = useCallback(
    () => setIndex((i) => Math.max(i - 1, 0)),
    []
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  return (
    <div className="relative min-h-screen pb-32">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
        >
          {slides[index]}
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
    <div className="sticky bottom-6 mt-16 flex justify-center items-center gap-6">
      <button onClick={prev} disabled={index === 0} className="text-white/70">
        ← Previous
      </button>

      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-6 rounded-full ${
              i === index ? "bg-cyan-400" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      <button
        onClick={next}
        disabled={index === total - 1}
        className="text-white/70"
      >
        Next →
      </button>
    </div>
  );
}

/* -------------------- SIMPLE CHART -------------------- */

function Chart({ title, data }: { title: string; data: number[] }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-4">
      <h3 className="text-white text-sm mb-3">{title}</h3>
      <div className="h-32 bg-black/30 rounded" />
    </div>
  );
}
<div className="fixed bottom-2 right-2 text-xs text-red-400 z-50">
  Commit: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
</div>
