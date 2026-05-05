"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Sunrise, BookHeart, Users, Sparkles } from "lucide-react";

const STORY_STEPS = [
  {
    id: 1,
    time: "8:00 AM",
    title: "Morning Check-In",
    emoji: "🌅",
    icon: Sunrise,
    color: "#ffd166",
    bgColor: "#ffd166",
    description: "Priya walks into class. Instead of jumping straight to textbooks, her teacher asks: \"How are you feeling today?\" Using a feelings chart, Priya identifies she's nervous about a test. Her teacher acknowledges it — and suddenly, the anxiety feels smaller.",
    sel_skill: "Self-Awareness",
  },
  {
    id: 2,
    time: "10:30 AM",
    emoji: "📚",
    title: "Story Time with Purpose",
    icon: BookHeart,
    color: "#36ba98",
    bgColor: "#36ba98",
    description: "The class reads a story about a fox who feels left out. The teacher pauses: \"Have you ever felt like this?\" Students discuss, share, and realize they're not alone. Empathy grows through stories.",
    sel_skill: "Social Awareness",
  },
  {
    id: 3,
    time: "1:00 PM",
    emoji: "🤝",
    title: "Collaborative Project",
    icon: Users,
    color: "#1a4895",
    bgColor: "#1a4895",
    description: "During group work, two students disagree. Instead of the teacher solving it, the kids use the 'I-message' technique: \"I feel frustrated when...\" They resolve it themselves. Conflict becomes a learning moment.",
    sel_skill: "Relationship Skills",
  },
  {
    id: 4,
    time: "3:00 PM",
    emoji: "✨",
    title: "Reflection & Gratitude",
    icon: Sparkles,
    color: "#ff6e79",
    bgColor: "#ff6e79",
    description: "Before going home, each child writes one thing they're grateful for and one kind act they witnessed. Priya writes: \"Ravi shared his crayons when mine broke.\" The day ends with connection, not just knowledge.",
    sel_skill: "Responsible Decision-Making",
  },
];

export default function StorySection() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STORY_STEPS[currentStep];

  return (
    <section className="section-spacing bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[#1a4895] font-semibold text-sm uppercase tracking-widest mb-4 block">Interactive Storytelling</span>
          <h2 className="font-headline text-4xl md:text-5xl text-[#111827] tracking-tight leading-tight mb-4">
            A Day in an SEL Classroom
          </h2>
          <p className="text-lg text-gray-500">Click through to experience how Social Emotional Learning transforms an ordinary school day.</p>
        </motion.div>

        {/* Story Navigator */}
        <div className="max-w-4xl mx-auto">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-12 px-4">
            {STORY_STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className="flex flex-col items-center gap-2 group relative"
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl transition-all
                    ${i === currentStep
                      ? "scale-110 shadow-lg"
                      : i < currentStep
                        ? "opacity-60"
                        : "opacity-30"
                    }`}
                  style={{
                    backgroundColor: i === currentStep ? `${s.bgColor}20` : "#f1f5f9",
                    border: i === currentStep ? `2px solid ${s.color}` : "2px solid transparent",
                  }}
                >
                  {s.emoji}
                </div>
                <span className={`text-xs font-semibold hidden md:block transition-colors ${i === currentStep ? "text-[#111827]" : "text-gray-400"}`}>
                  {s.time}
                </span>
                {/* Connector line */}
                {i < STORY_STEPS.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] h-[2px] bg-gray-200 hidden md:block -z-10"
                    style={{
                      width: "calc(200% - 56px)",
                      backgroundColor: i < currentStep ? step.color : "#e2e8f0"
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Story Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
              style={{ backgroundColor: `${step.bgColor}08`, border: `1px solid ${step.bgColor}20` }}
            >
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{step.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: step.color }}>{step.time}</div>
                      <h3 className="text-2xl md:text-3xl font-bold text-[#111827]">{step.title}</h3>
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed mb-8">{step.description}</p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: `${step.bgColor}15`, color: step.color }}>
                    <step.icon size={16} />
                    SEL Skill: {step.sel_skill}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t" style={{ borderColor: `${step.bgColor}20` }}>
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                <span className="text-sm text-gray-400 font-medium">
                  {currentStep + 1} / {STORY_STEPS.length}
                </span>
                <button
                  onClick={() => setCurrentStep(Math.min(STORY_STEPS.length - 1, currentStep + 1))}
                  disabled={currentStep === STORY_STEPS.length - 1}
                  className="flex items-center gap-2 text-sm font-semibold hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  style={{ color: step.color }}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
