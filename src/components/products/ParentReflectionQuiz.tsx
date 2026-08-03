"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Heart, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const AGREE_SCALE = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];
const FREQ_SCALE = ["Never", "Rarely", "Sometimes", "Often", "Almost Always"];

// Part A + B — scale questions grouped into steps
const SCALE_STEPS = [
  {
    id: "emotions",
    title: "Children's Emotions",
    accent: "#FF5C7A",
    scale: AGREE_SCALE,
    questions: [
      { id: "a1", text: "Children should learn to control their emotions as quickly as possible." },
      { id: "a2", text: "Crying is a healthy way for children to express emotions." },
      { id: "a3", text: "Understanding why a child behaves a certain way is as important as correcting the behaviour." },
      { id: "a4", text: "Talking about feelings helps children grow." },
    ],
  },
  {
    id: "parenting",
    title: "Parenting",
    accent: "#7C3AED",
    scale: AGREE_SCALE,
    questions: [
      { id: "a5", text: "Parents don't always have the right answer, and that's okay." },
      { id: "a6", text: "The way I respond to my child's emotions influences how they learn to handle their own emotions." },
      { id: "a7", text: "My own childhood experiences influence the way I parent." },
      { id: "a8", text: "Looking after my own emotional well-being is part of being a parent." },
    ],
  },
  {
    id: "learning",
    title: "Learning",
    accent: "#00CDBA",
    scale: AGREE_SCALE,
    questions: [
      { id: "a9", text: "Parenting is something we continue learning throughout life." },
      { id: "a10", text: "I am open to trying new ways of responding to my child." },
    ],
  },
  {
    id: "everyday",
    title: "Everyday Parenting",
    accent: "#268bff",
    scale: FREQ_SCALE,
    subtitle: "How often do these happen?",
    questions: [
      { id: "b11", text: "I find myself reacting before I have time to think." },
      { id: "b12", text: "I wonder later if I could have responded differently." },
      { id: "b13", text: "My child shares their worries or feelings with me." },
      { id: "b14", text: "I talk to my child about emotions, not just behaviour." },
      { id: "b15", text: "I find it difficult to know what my child needs when they are upset." },
    ],
  },
];

const FIRST_THOUGHT = [
  "How do I calm them?",
  "Why are they behaving this way?",
  "What are they feeling?",
  "How will others see this?",
];
const DIFFICULT_SITUATIONS = [
  "Tantrums", "Crying", "Anger", "Not listening",
  "Anxiety/Fear", "Sibling conflict", "Screen-time disagreements", "Homework",
];
const WHEN_DIFFICULT = [
  "Talk to my partner/family", "Search online", "Ask teachers",
  "Read books", "Handle it on my own", "I'm not sure what to do",
];

const ADMIN_EMAIL = "kirti@vetaas.in";

export default function ParentReflectionQuiz() {
  // step -1 intro, 0-3 scale steps, 4 reflection, 5 done
  const [step, setStep] = useState(-1);
  const [scale, setScale] = useState<Record<string, number>>({});
  const [firstThought, setFirstThought] = useState("");
  const [firstThoughtOther, setFirstThoughtOther] = useState("");
  const [situations, setSituations] = useState<string[]>([]);
  const [coping, setCoping] = useState<string[]>([]);
  const [wish, setWish] = useState("");
  const [hardest, setHardest] = useState("");

  const totalSteps = SCALE_STEPS.length + 1; // scale steps + reflection

  const toggle = (list: string[], set: (v: string[]) => void, val: string) =>
    set(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  const scaleStepComplete = (idx: number) =>
    SCALE_STEPS[idx].questions.every((q) => scale[q.id] !== undefined);

  const canContinue = () => {
    if (step === -1) return true;
    if (step >= 0 && step < SCALE_STEPS.length) return scaleStepComplete(step);
    return true;
  };

  const next = () => setStep((s) => (s === -1 ? 0 : s + 1));
  const back = () => setStep((s) => (s === 0 ? -1 : s - 1));

  const progress = Math.max(0, step) / totalSteps * 100;

  const resultsBody = () => {
    const lines: string[] = ["In Sync — Parent Reflection responses:", ""];
    SCALE_STEPS.forEach((sec) => {
      lines.push(`# ${sec.title}`);
      sec.questions.forEach((q) => {
        const v = scale[q.id];
        lines.push(`- ${q.text}\n  → ${v ? sec.scale[v - 1] : "—"}`);
      });
      lines.push("");
    });
    lines.push("# Reflection");
    lines.push(`First thought when child is upset: ${firstThought === "Other" ? firstThoughtOther : firstThought || "—"}`);
    lines.push(`Most difficult situations: ${situations.join(", ") || "—"}`);
    lines.push(`When parenting feels difficult: ${coping.join(", ") || "—"}`);
    lines.push(`Wish someone had taught: ${wish || "—"}`);
    lines.push(`Hardest part of parenting: ${hardest || "—"}`);
    return lines.join("\n");
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  return (
    <div className="relative w-full flex flex-col items-center py-12 px-4 bg-[#FAFAFA] font-[family-name:var(--font-poppins)] overflow-hidden min-h-[80vh]">
      <div className="absolute top-[20%] left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-[#7C3AED]/5 to-[#00CDBA]/5 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-bl from-[#FF5C7A]/5 to-[#FFC107]/5 blur-[120px] pointer-events-none z-0" />

      {/* Progress */}
      {step >= 0 && step <= totalSteps - 1 && (
        <div className="w-full max-w-3xl mx-auto mb-10 px-4 relative z-10">
          <div className="flex justify-between text-sm font-bold mb-3 text-[#7C3AED]">
            <span>Your reflection</span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-[#00CDBA] transition-all duration-700" style={{ width: `${Math.max(2, progress)}%` }} />
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl relative z-10">
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {step === -1 && (
            <motion.div key="intro" variants={variants} initial="hidden" animate="visible" exit="exit" className="p-8 md:p-16 text-center">
              <div className="inline-block p-4 bg-white border border-gray-100 rounded-full mb-6 shadow-sm">
                <Heart className="w-8 h-8 text-[#FF5C7A]" fill="currentColor" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold font-headline mb-6 tracking-tight text-gray-900">
                In Sync: Parent Reflection &amp; Beliefs
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                A gentle, judgment-free reflection on your beliefs and everyday moments as a parent.
                There are no right or wrong answers — just a chance to pause and notice.
              </p>
              <button
                onClick={next}
                className="bg-gray-900 text-white font-medium py-3.5 px-8 rounded-full text-base transition-all hover:bg-gray-800 hover:shadow-lg inline-flex items-center gap-2"
              >
                Begin Reflection <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* SCALE STEPS (Part A & B) */}
          {step >= 0 && step < SCALE_STEPS.length && (
            <motion.div key={`scale-${step}`} variants={variants} initial="hidden" animate="visible" exit="exit" className="p-4 md:p-8">
              {(() => {
                const sec = SCALE_STEPS[step];
                return (
                  <>
                    <div className="mb-8">
                      <span className="font-medium text-xs uppercase tracking-widest mb-1 block text-gray-400">
                        Step {step + 1} of {totalSteps}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900" style={{ color: sec.accent }}>{sec.title}</h2>
                      {sec.subtitle && <p className="text-gray-500 font-medium mt-1">{sec.subtitle}</p>}
                    </div>
                    <div className="space-y-5">
                      {sec.questions.map((q, idx) => (
                        <div key={q.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100/60">
                          <p className="text-base text-gray-800 font-medium mb-4 flex items-start gap-2.5">
                            <span style={{ color: sec.accent }} className="font-semibold">{idx + 1}.</span> {q.text}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                            {sec.scale.map((label, i) => {
                              const val = i + 1;
                              const selected = scale[q.id] === val;
                              return (
                                <button
                                  key={label}
                                  onClick={() => setScale((p) => ({ ...p, [q.id]: val }))}
                                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${selected ? "text-white shadow-sm" : "bg-[#FAFAFA] border-transparent text-gray-500 hover:bg-gray-100"}`}
                                  style={selected ? { backgroundColor: sec.accent, borderColor: sec.accent } : undefined}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* REFLECTION (Part C) */}
          {step === SCALE_STEPS.length && (
            <motion.div key="reflection" variants={variants} initial="hidden" animate="visible" exit="exit" className="p-4 md:p-8 space-y-6">
              <div className="mb-2">
                <span className="font-medium text-xs uppercase tracking-widest mb-1 block text-gray-400">
                  Step {totalSteps} of {totalSteps}
                </span>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#FFC107]">A little reflection</h2>
              </div>

              {/* C1 */}
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100/60">
                <p className="font-semibold text-gray-800 mb-4">When your child is upset, what is usually your first thought?</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[...FIRST_THOUGHT, "Other"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFirstThought(opt)}
                      className={`py-2.5 px-4 rounded-xl text-sm font-medium text-left transition-all border ${firstThought === opt ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-[#FAFAFA] border-transparent text-gray-600 hover:bg-gray-100"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {firstThought === "Other" && (
                  <input
                    value={firstThoughtOther}
                    onChange={(e) => setFirstThoughtOther(e.target.value)}
                    placeholder="Tell us more…"
                    className="mt-3 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7C3AED]"
                  />
                )}
              </div>

              {/* C2 */}
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100/60">
                <p className="font-semibold text-gray-800 mb-4">Which situations are most difficult for you? <span className="text-gray-400 font-normal text-sm">(select all)</span></p>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULT_SITUATIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggle(situations, setSituations, opt)}
                      className={`py-2 px-4 rounded-full text-sm font-medium transition-all border ${situations.includes(opt) ? "bg-[#FF5C7A] text-white border-[#FF5C7A]" : "bg-[#FAFAFA] border-transparent text-gray-600 hover:bg-gray-100"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* C3 */}
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100/60">
                <p className="font-semibold text-gray-800 mb-4">When parenting feels difficult, I usually… <span className="text-gray-400 font-normal text-sm">(select all)</span></p>
                <div className="flex flex-wrap gap-2">
                  {WHEN_DIFFICULT.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggle(coping, setCoping, opt)}
                      className={`py-2 px-4 rounded-full text-sm font-medium transition-all border ${coping.includes(opt) ? "bg-[#00CDBA] text-white border-[#00CDBA]" : "bg-[#FAFAFA] border-transparent text-gray-600 hover:bg-gray-100"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* C4 & C5 */}
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100/60 space-y-4">
                <div>
                  <label className="font-semibold text-gray-800 block mb-2">What do you wish someone had taught you about parenting?</label>
                  <textarea value={wish} onChange={(e) => setWish(e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7C3AED] resize-none" />
                </div>
                <div>
                  <label className="font-semibold text-gray-800 block mb-2">The hardest part of parenting for me is…</label>
                  <textarea value={hardest} onChange={(e) => setHardest(e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7C3AED] resize-none" />
                </div>
              </div>
            </motion.div>
          )}

          {/* DONE */}
          {step === totalSteps && (
            <motion.div key="done" variants={variants} initial="hidden" animate="visible" exit="exit" className="p-8 md:p-14 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 shadow-sm border border-gray-100">
                <CheckCircle2 className="w-9 h-9 text-[#00CDBA]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold font-headline mb-3 text-gray-900">Thank you for reflecting 💛</h2>
              <p className="text-gray-500 font-medium max-w-xl mx-auto mb-10">
                Noticing our own patterns is the first step. Share your reflection with us and we&apos;ll
                suggest gentle next steps and resources tailored for you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                <a
                  href={`mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent("In Sync — Parent Reflection")}&body=${encodeURIComponent(resultsBody())}`}
                  className="flex-1 bg-gray-900 text-white font-medium text-sm py-3 px-6 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Email my reflection
                </a>
                <Link href="/services#membership" className="flex-1 bg-white border border-gray-200 text-gray-800 font-medium text-sm py-3 px-6 rounded-full hover:bg-gray-50 transition-colors">
                  Explore support
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAV */}
        {step > -1 && step <= totalSteps - 1 && (
          <div className="w-full flex justify-between items-center relative z-20 mt-8 pt-6 border-t border-gray-200 px-4">
            <button onClick={back} className="flex items-center gap-2 text-gray-500 font-medium px-4 py-2 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-colors text-sm">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={next}
              disabled={!canContinue()}
              className={`flex items-center gap-2 font-medium px-6 py-2.5 rounded-full transition-colors text-sm ${canContinue() ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              {step === totalSteps - 1 ? "Finish" : "Continue"}
              {step !== totalSteps - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
