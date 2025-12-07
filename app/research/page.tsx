"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
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

// Mock Data
const accuracyData = [0.62, 0.71, 0.78, 0.82, 0.86];
const lossData = [1.3, 0.98, 0.72, 0.55, 0.43];

export default function ResearchPage() {
  const [activeImage, setActiveImage] = useState<number | null>(null);

  const tissueImages = [
    { src: "/research/10.jpg", label: "TDP-43, BA44 – Control" },
    { src: "/research/24.jpg", label: "TDP-43, BA46 – Discordant" },
    { src: "/research/104.jpg", label: "TDP-43, BA44 – Concordant" },
  ];

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
      {/* SECTION 1 – Overview */}
      <SectionWrapper>
        <div className="max-w-6xl mx-auto w-full px-6 pt-20 pb-10">
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-4"
          >
            Research Overview
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-center text-white/70 max-w-2xl mx-auto mb-10"
          >
            A modern visualization of the NeuroBioMark study pipeline, dataset,
            tissue samples, and model performance.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Images"
              value="190"
              detail="Original TDP-43 histopathology tiles."
              icon={<Database className="text-cyan-400" size={28} />}
            />
            <MetricCard
              title="Output Classes"
              value="3"
              detail="Control, Discordant, Concordant."
              icon={<Layers className="text-cyan-400" size={28} />}
            />
            <MetricCard
              title="Augmentations"
              value="15"
              detail="Geometric & photometric transforms."
              icon={<FlaskConical className="text-cyan-400" size={28} />}
            />
            <MetricCard
              title="Cross-Validation Folds"
              value="5"
              detail="Patient-level Group-CV."
              icon={<Scan className="text-cyan-400" size={28} />}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 2 – Pipeline */}
      <SectionWrapper>
        <div className="max-w-6xl mx-auto w-full px-6 pt-20 pb-10 space-y-10">
          <SectionTitle
            icon={<Brain className="text-cyan-400" size={30} />}
            title="Research Pipeline"
            subtitle="From raw tissue images to explainable predictions."
          />

          <ResearchPipeline />
        </div>
      </SectionWrapper>

      {/* SECTION 3 – Charts */}
      <SectionWrapper>
        <div className="max-w-6xl mx-auto w-full px-6 pt-20 pb-10 space-y-8">
          <SectionTitle
            icon={<BarChart3 className="text-cyan-400" size={30} />}
            title="Model Performance"
            subtitle="Training dynamics demonstrating model stability and improvement."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedLineChart
              title="Accuracy per Epoch"
              data={accuracyData}
              yLabel="Accuracy"
            />
            <AnimatedLineChart
              title="Loss per Epoch"
              data={lossData}
              yLabel="Loss"
            />
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 4 – Tissue Samples */}
      <SectionWrapper>
        <div className="max-w-6xl mx-auto w-full px-6 pt-20 pb-10 space-y-8">
          <SectionTitle
            icon={<ImageIcon className="text-cyan-400" size={30} />}
            title="TDP-43 Tissue Examples"
            subtitle="Representative regions from ALS and control cohorts."
          />

          <TissueGallery
            images={tissueImages}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />
        </div>
      </SectionWrapper>

      {/* SECTION 5 – Model Pipeline Visualization */}
      <SectionWrapper>
        <div className="max-w-6xl mx-auto w-full px-6 pt-20 pb-10 space-y-8">
          <SectionTitle
            icon={<Activity className="text-cyan-400" size={30} />}
            title="Model Pipeline & Explainability"
            subtitle="From image tiles to interpretable heatmaps."
          />

          <ModelPipelineViz />
        </div>
      </SectionWrapper>
    </div>
  );
}

//
// SECTION WRAPPER (with gradient overlay)
//
function SectionWrapper({ children }: { children: ReactNode }) {
  return (
    <section className="snap-start min-h-screen flex items-center py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 pointer-events-none" />
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}

//
// METRIC CARD
//
function MetricCard({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-md"
    >
      <div className="flex items-center justify-between mb-2">
        {icon}
        <div className="text-2xl font-semibold text-white">{value}</div>
      </div>

      <p className="text-xs text-white/70">{title}</p>

      <p className="text-xs text-white/60 mt-1 group-hover:text-white transition">
        {detail}
      </p>
    </motion.div>
  );
}

//
// SECTION TITLE
//
function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-white/70 text-sm md:text-base">{subtitle}</p>
      )}
    </div>
  );
}

//
// PIPELINE VISUALIZATION
//
const pipelineSteps = [
  "Dataset",
  "Augmentation",
  "Preprocessing",
  "Model",
  "Explainability",
  "Results",
];

function ResearchPipeline() {
  return (
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl p-8 overflow-hidden">
      {/* Glow bar */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 h-1 w-[80%] left-[10%] bg-gradient-to-r from-cyan-400/40 via-cyan-300/70 to-transparent rounded-full"
      />

      {/* Moving node */}
      <motion.div
        className="absolute h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.9)] top-1/2 -translate-y-1/2"
        initial={{ left: "10%" }}
        animate={{ left: ["10%", "90%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />

      {/* Nodes */}
      <div className="relative flex justify-between items-center w-full">
        {pipelineSteps.map((step, idx) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="h-10 w-10 rounded-full border border-cyan-300/60 bg-black/40 flex items-center justify-center text-xs text-cyan-100">
              {idx + 1}
            </div>
            <p className="text-xs text-white/80">{step}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

//
// ANIMATED LINE CHART
//
function AnimatedLineChart({
  title,
  data,
  yLabel,
}: {
  title: string;
  data: number[];
  yLabel: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / (max - min)) * 80 - 10;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  return (
    <div className="bg-white/5 border border-white/15 rounded-2xl p-5 backdrop-blur-xl shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <span className="text-[11px] text-white/60">{yLabel}</span>
      </div>

      <div className="relative h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={0.4}
            />
          ))}

          <motion.path
            d={pathData}
            fill="none"
            stroke="rgba(45,212,191,0.9)"
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {points.map((p, i) => {
            const [x, y] = p.split(",");
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={1.3}
                fill="rgba(34,211,238,0.9)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

//
// TISSUE GALLERY
//
function TissueGallery({
  images,
  activeImage,
  setActiveImage,
}: {
  images: { src: string; label: string }[];
  activeImage: number | null;
  setActiveImage: (i: number | null) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveImage(idx)}
            className="rounded-xl overflow-hidden bg-white/5 border border-white/20 shadow-sm relative"
          >
            <div
              className="h-32 md:h-40 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${img.src})` }}
            />
            <p className="text-xs text-white/75 px-3 py-2">{img.label}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeImage !== null && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              className="bg-black/80 border border-white/20 rounded-2xl p-4 max-w-3xl w-[90%]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full h-[60vh] bg-cover bg-center rounded-xl"
                style={{
                  backgroundImage: `url(${images[activeImage].src})`,
                }}
              />
              <p className="mt-3 text-sm text-white/80">
                {images[activeImage].label}
              </p>
              <button
                onClick={() => setActiveImage(null)}
                className="mt-3 text-xs text-white/70 hover:text-white"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

//
// MODEL PIPELINE
//
function ModelPipelineViz() {
  const stages = [
    "Input Tile",
    "Feature Extractor",
    "Attention / CAM",
    "Classifier",
    "ALS Class Output",
  ];

  return (
    <div className="bg-white/5 border border-white/15 rounded-2xl p-8 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {stages.map((stage, idx) => (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="w-32 h-16 rounded-xl border border-cyan-400/60 bg-black/40 flex items-center justify-center text-[11px] text-center text-white/85 shadow-[0_0_18px_rgba(34,211,238,0.15)]">
              {stage}
            </div>

            {idx < stages.length - 1 && (
              <motion.div
                className="hidden md:block h-px w-14 bg-gradient-to-r from-cyan-400/60 to-transparent mt-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-xs text-white/75 leading-relaxed">
        Tiles from TDP-43–stained slides are processed by a deep CNN backbone.
        Attention mechanisms (e.g., Grad-CAM) highlight regions that drive
        predictions, which are compared against annotated ROIs to assess the
        Focus Relevance Score.
      </p>
    </div>
  );
}
