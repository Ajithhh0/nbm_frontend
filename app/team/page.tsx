"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";

const team = [
  {
    name: "A",
    role: "Lead Researcher",
    desc: "Coordinates project direction, validates AI outputs, and ensures scientific quality.",
    img: "/person.png",
    linkedin: "#",
    email: "mailto:placeholder@example.com",
  },
  {
    name: "B",
    role: "Machine Learning Engineer",
    desc: "Develops deep learning models, manages training pipelines, and ensures inference efficiency.",
    img: "/person.png",
    linkedin: "#",
    email: "mailto:placeholder@example.com",
  },
  {
    name: "C",
    role: "Data Scientist",
    desc: "Runs statistical workflows, conducts exploratory analysis, and safeguards dataset quality.",
    img: "/person.png",
    linkedin: "#",
    email: "mailto:placeholder@example.com",
  },
  {
    name: "D",
    role: "Software Developer",
    desc: "Implements backend logic, optimizes performance, and builds scalable features.",
    img: "/person.png",
    linkedin: "#",
    email: "mailto:placeholder@example.com",
  },
  {
    name: "E",
    role: "UX / UI Designer",
    desc: "Designs intuitive interfaces and elevates user experience across the platform.",
    img: "/person.png",
    linkedin: "#",
    email: "mailto:placeholder@example.com",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-24 pb-32 px-4 text-white">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-2"
      >
        Our Team
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-white/70 text-center max-w-2xl mb-16"
      >
        A multidisciplinary group of researchers, engineers, and designers working
        together to advance AI-driven neuroscience.
      </motion.p>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl hover:shadow-cyan-500/20 transition"
          >
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28 rounded-full border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)] overflow-hidden">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Name */}
            <h2 className="text-center text-xl font-semibold">{member.name}</h2>

            {/* Role */}
            <h3 className="text-center text-cyan-300 text-sm font-medium mt-1">
              {member.role}
            </h3>

            {/* Description */}
            <p className="text-white/70 text-sm mt-3 text-center leading-relaxed">
              {member.desc}
            </p>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 mt-5">
              <a
                href={member.linkedin}
                target="_blank"
                className="p-2 rounded-full bg-white/5 hover:bg-white/20 border border-white/20 transition"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={member.email}
                className="p-2 rounded-full bg-white/5 hover:bg-white/20 border border-white/20 transition"
              >
                <Mail size={20} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
