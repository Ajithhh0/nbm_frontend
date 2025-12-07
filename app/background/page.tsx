"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Search,
  Lightbulb,
  Shield,
  Microscope,
  Activity,
} from "lucide-react";

export default function BackgroundPage() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const cards = [
    {
      id: "als",
      icon: <Brain size={36} className="text-cyan-300" />,
      title: "What is ALS?",
      content: (
        <>
          <p>
            Amyotrophic Lateral Sclerosis (ALS) is a progressive neurodegenerative
            disorder affecting nerve cells in the brain and spinal cord. It leads
            to muscle weakness, motor dysfunction, and respiratory failure.
          </p>
          <p className="mt-3 opacity-80">
            The underlying cause remains unknown and there is currently no cure.
          </p>
        </>
      ),
    },

    {
      id: "diagnosis",
      icon: <Search size={36} className="text-cyan-300" />,
      title: "Need for Early Diagnosis",
      content: (
        <>
          <p>Early diagnosis of ALS is important for:</p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Starting treatments sooner</li>
            <li>Improving symptom management</li>
            <li>Clinical trial availability</li>
          </ul>

          <p className="mt-4 opacity-80">Challenges include:</p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Overlapping symptoms</li>
            <li>No definitive diagnostic tests</li>
            <li>Patient-to-patient variability</li>
          </ul>
        </>
      ),
    },

    {
      id: "biomarkers",
      icon: <Lightbulb size={36} className="text-cyan-300" />,
      title: "Neurological Biomarkers",
      content: (
        <>
          <p>
            Neurological biomarkers reflect changes in brain structure, function,
            or physiology. They guide diagnosis and research.
          </p>

          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Brain imaging (MRI, CT, PET)</li>
            <li>Signals (EEG, EMG)</li>
            <li>Biological samples (blood, CSF)</li>
            <li>Digital biomarkers (speech, gait, facial cues)</li>
            <li>Tongue image analysis</li>
          </ul>
        </>
      ),
    },

    {
      id: "explainability",
      icon: <Shield size={36} className="text-cyan-300" />,
      title: "Why Explainability Matters",
      content: (
        <>
          <p>
            Explainability builds clinical trust by clarifying how AI models make
            decisions.
          </p>

          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Detects unsafe model behavior</li>
            <li>Ensures biological relevance</li>
            <li>Supports clinical reasoning</li>
            <li>Required for regulatory approval</li>
          </ul>
        </>
      ),
    },

    {
      id: "challenges",
      icon: <Activity size={36} className="text-cyan-300" />,
      title: "Challenges & Opportunities",
      content: (
        <>
          <ul className="list-disc ml-6 space-y-2">
            <li>Voice biomarkers</li>
            <li>Movement signals</li>
            <li>Physiological signals</li>
            <li>Tongue images</li>
          </ul>

          <p className="mt-4 opacity-80">Challenges include:</p>

          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Limited interpretability</li>
            <li>Small datasets</li>
            <li>Clinical validation needs</li>
            <li>Ethical/privacy concerns</li>
          </ul>
        </>
      ),
    },

    {
      id: "software",
      icon: <Microscope size={36} className="text-cyan-300" />,
      title: "Diagnostic Software",
      content: (
        <>
          <p>
            Our clinician-friendly AI platform analyzes TDP-43 stained
            histopathology images to support ALS detection.
          </p>
          <p className="mt-3 opacity-80">
            It integrates deep learning, explainability, and pathology-validated
            insights to provide transparent and actionable outputs.
          </p>
        </>
      ),
    },
  ];

  return (
    <main className="relative z-10 px-6 py-32 max-w-6xl mx-auto">

      {/* TITLE */}
      <h1 className="text-center text-5xl font-bold text-white mb-12">
        Background
      </h1>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => setActiveCard(card.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="
              cursor-pointer bg-white/10 backdrop-blur-xl
              border border-white/20 rounded-2xl p-6 text-white
              shadow-md hover:shadow-cyan-400/30 transition
              flex flex-col items-start gap-4
            "
          >
            {card.icon}
            <h3 className="text-xl font-semibold">{card.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* MODAL POPUP */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed inset-0 bg-black/60 backdrop-blur-md flex 
              items-center justify-center z-[200]
            "
            onClick={() => setActiveCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="
                bg-white/10 backdrop-blur-2xl border border-white/20
                p-10 rounded-2xl max-w-xl w-full shadow-xl text-white
              "
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {cards.find((x) => x.id === activeCard)?.title}
                </h2>
                <button
                  onClick={() => setActiveCard(null)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="text-white/90 leading-relaxed space-y-4">
                {cards.find((x) => x.id === activeCard)?.content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
