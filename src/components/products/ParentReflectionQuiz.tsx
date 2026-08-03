"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, CheckCircle2, Check } from "lucide-react";
import Link from "next/link";

const AGREE = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
const FREQ = ["Never", "Rarely", "Sometimes", "Often", "Almost Always"];
const FIRST_THOUGHT = [
  "How do I calm them?",
  "Why are they behaving this way?",
  "What are they feeling?",
  "How will others see this?",
  "Other",
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

type Question = {
  id: string;
  section: string;
  accent: string;
  kind: "scale" | "single" | "multi" | "text";
  text: string;
  options?: string[];
};

const QUESTIONS: Question[] = [
  // Part A — Children's Emotions
  { id: "a1", section: "Children's Emotions", accent: "#FF5C7A", kind: "scale", options: AGREE, text: "Children should learn to control their emotions as quickly as possible." },
  { id: "a2", section: "Children's Emotions", accent: "#FF5C7A", kind: "scale", options: AGREE, text: "Crying is a healthy way for children to express emotions." },
  { id: "a3", section: "Children's Emotions", accent: "#FF5C7A", kind: "scale", options: AGREE, text: "Understanding why a child behaves a certain way is as important as correcting the behaviour." },
  { id: "a4", section: "Children's Emotions", accent: "#FF5C7A", kind: "scale", options: AGREE, text: "Talking about feelings helps children grow." },
  // Part A — Parenting
  { id: "a5", section: "Parenting", accent: "#7C3AED", kind: "scale", options: AGREE, text: "Parents don't always have the right answer, and that's okay." },
  { id: "a6", section: "Parenting", accent: "#7C3AED", kind: "scale", options: AGREE, text: "The way I respond to my child's emotions influences how they learn to handle their own emotions." },
  { id: "a7", section: "Parenting", accent: "#7C3AED", kind: "scale", options: AGREE, text: "My own childhood experiences influence the way I parent." },
  { id: "a8", section: "Parenting", accent: "#7C3AED", kind: "scale", options: AGREE, text: "Looking after my own emotional well-being is part of being a parent." },
  // Part A — Learning
  { id: "a9", section: "Learning", accent: "#00CDBA", kind: "scale", options: AGREE, text: "Parenting is something we continue learning throughout life." },
  { id: "a10", section: "Learning", accent: "#00CDBA", kind: "scale", options: AGREE, text: "I am open to trying new ways of responding to my child." },
  // Part B — Everyday Parenting
  { id: "b11", section: "Everyday Parenting", accent: "#268bff", kind: "scale", options: FREQ, text: "I find myself reacting before I have time to think." },
  { id: "b12", section: "Everyday Parenting", accent: "#268bff", kind: "scale", options: FREQ, text: "I wonder later if I could have responded differently." },
  { id: "b13", section: "Everyday Parenting", accent: "#268bff", kind: "scale", options: FREQ, text: "My child shares their worries or feelings with me." },
  { id: "b14", section: "Everyday Parenting", accent: "#268bff", kind: "scale", options: FREQ, text: "I talk to my child about emotions, not just behaviour." },
  { id: "b15", section: "Everyday Parenting", accent: "#268bff", kind: "scale", options: FREQ, text: "I find it difficult to know what my child needs when they are upset." },
  // Part C — Reflection
  { id: "c1", section: "Reflection", accent: "#7C3AED", kind: "single", options: FIRST_THOUGHT, text: "When your child is upset, what is usually your first thought?" },
  { id: "c2", section: "Reflection", accent: "#FF5C7A", kind: "multi", options: DIFFICULT_SITUATIONS, text: "Which situations are most difficult for you?" },
  { id: "c3", section: "Reflection", accent: "#00CDBA", kind: "multi", options: WHEN_DIFFICULT, text: "When parenting feels difficult, I usually…" },
  { id: "c4", section: "Reflection", accent: "#FFC107", kind: "text", text: "What do you wish someone had taught you about parenting?" },
  { id: "c5", section: "Reflection", accent: "#FFC107", kind: "text", text: "The hardest part of parenting for me is…" },
];

const TOTAL = QUESTIONS.length;

export default function ParentReflectionQuiz() {
  const [index, setIndex] = useState(-1); // -1 intro, 0..TOTAL-1 questions, TOTAL done
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [otherText, setOtherText] = useState("");

  const q = index >= 0 && index < TOTAL ? QUESTIONS[index] : null;

  const goNext = () => setIndex((i) => Math.min(TOTAL, i + 1));
  const goBack = () => setIndex((i) => Math.max(-1, i - 1));

  // Single-answer selection with auto-advance
  const selectSingle = (question: Question, value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    // "Other" needs a typed value first — don't auto-advance
    if (question.kind === "single" && value === "Other") return;
    setTimeout(goNext, 280);
  };

  const toggleMulti = (question: Question, value: string) => {
    setAnswers((prev) => {
      const cur = (prev[question.id] as string[]) || [];
      return {
        ...prev,
        [question.id]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
      };
    });
  };

  const canContinue = () => {
    if (!q) return true;
    const a = answers[q.id];
    if (q.kind === "text") return true; // optional
    if (q.kind === "multi") return true; // optional
    if (q.kind === "single" && a === "Other") return otherText.trim().length > 0;
    return a !== undefined;
  };

  const progress = ((Math.max(0, index)) / TOTAL) * 100;

  const resultsBody = () => {
    const lines: string[] = ["In Sync — Parent Reflection responses:", ""];
    let lastSection = "";
    QUESTIONS.forEach((question) => {
      if (question.section !== lastSection) {
        lines.push(`\n# ${question.section}`);
        lastSection = question.section;
      }
      let a = answers[question.id];
      if (question.id === "c1" && a === "Other") a = `Other: ${otherText}`;
      lines.push(`- ${question.text}\n  → ${Array.isArray(a) ? a.join(", ") || "—" : a || "—"}`);
    });
    return lines.join("\n");
  };

  const variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.32, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative w-full flex flex-col items-center px-4 py-10 bg-[#FAFAFA] font-[family-name:var(--font-poppins)] overflow-hidden min-h-[80vh]">
      <div className="absolute top-[15%] left-[8%] w-[45vw] h-[45vw] max-w-[560px] max-h-[560px] rounded-full bg-gradient-to-tr from-[#7C3AED]/5 to-[#00CDBA]/5 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[8%] right-[5%] w-[38vw] h-[38vw] max-w-[480px] max-h-[480px] rounded-full bg-gradient-to-bl from-[#FF5C7A]/5 to-[#FFC107]/5 blur-[120px] pointer-events-none z-0" />

      {/* Progress */}
      {index >= 0 && index < TOTAL && (
        <div className="w-full max-w-2xl mx-auto mb-8 relative z-10">
          <div className="flex justify-between text-xs font-bold mb-2 text-[#7C3AED]">
            <span>Question {index + 1} of {TOTAL}</span>
            <span className="bg-white px-3 py-0.5 rounded-full shadow-sm">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-[#00CDBA] transition-all duration-500" style={{ width: `${Math.max(2, progress)}%` }} />
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {index === -1 && (
            <motion.div key="intro" variants={variants} initial="hidden" animate="visible" exit="exit" className="text-center py-10">
              <div className="inline-block p-4 bg-white border border-gray-100 rounded-full mb-6 shadow-sm">
                <Heart className="w-8 h-8 text-[#FF5C7A]" fill="currentColor" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold font-headline mb-6 tracking-tight text-gray-900">
                In Sync: Parent Reflection &amp; Beliefs
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
                {TOTAL} short questions, one at a time. There are no right or wrong answers —
                just a chance to pause and notice.
              </p>
              <button
                onClick={goNext}
                className="bg-gray-900 text-white font-medium py-3.5 px-8 rounded-full text-base transition-all hover:bg-gray-800 hover:shadow-lg inline-flex items-center gap-2"
              >
                Begin Reflection <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* QUESTION */}
          {q && (
            <motion.div key={q.id} variants={variants} initial="hidden" animate="visible" exit="exit">
              <span className="font-bold text-xs uppercase tracking-widest mb-3 block" style={{ color: q.accent }}>
                {q.section}
              </span>
              <h2 className="text-2xl md:text-[1.75rem] font-semibold text-gray-900 leading-snug mb-8">
                {q.text}
              </h2>

              {/* Scale / single — vertical options, auto-advance */}
              {(q.kind === "scale" || q.kind === "single") && (
                <div className="flex flex-col gap-3">
                  {q.options!.map((opt) => {
                    const selected = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => selectSingle(q, opt)}
                        className={`w-full text-left px-5 py-3.5 rounded-2xl text-base font-medium border-2 transition-all flex items-center justify-between ${
                          selected ? "text-white shadow-sm" : "bg-white border-gray-100 text-gray-700 hover:border-gray-300"
                        }`}
                        style={selected ? { backgroundColor: q.accent, borderColor: q.accent } : undefined}
                      >
                        {opt}
                        {selected && <Check size={18} />}
                      </button>
                    );
                  })}
                  {q.kind === "single" && answers[q.id] === "Other" && (
                    <input
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder="Tell us more…"
                      autoFocus
                      className="mt-1 w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 text-base focus:outline-none focus:border-[#7C3AED]"
                    />
                  )}
                </div>
              )}

              {/* Multi — vertical checkboxes, manual continue */}
              {q.kind === "multi" && (
                <div className="flex flex-col gap-3">
                  {q.options!.map((opt) => {
                    const list = (answers[q.id] as string[]) || [];
                    const selected = list.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleMulti(q, opt)}
                        className={`w-full text-left px-5 py-3.5 rounded-2xl text-base font-medium border-2 transition-all flex items-center justify-between ${
                          selected ? "text-white shadow-sm" : "bg-white border-gray-100 text-gray-700 hover:border-gray-300"
                        }`}
                        style={selected ? { backgroundColor: q.accent, borderColor: q.accent } : undefined}
                      >
                        {opt}
                        {selected && <Check size={18} />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Text */}
              {q.kind === "text" && (
                <textarea
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  rows={4}
                  autoFocus
                  placeholder="Take your time…"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 text-base focus:outline-none focus:border-[#7C3AED] resize-none"
                />
              )}
            </motion.div>
          )}

          {/* DONE */}
          {index === TOTAL && (
            <motion.div key="done" variants={variants} initial="hidden" animate="visible" exit="exit" className="text-center py-10">
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
      </div>

      {/* NAV — Back always; Continue only for multi/text (single/scale auto-advance) */}
      {index >= 0 && index < TOTAL && (
        <div className="w-full max-w-2xl flex justify-between items-center relative z-20 mt-8 pt-5 border-t border-gray-200">
          <button onClick={goBack} className="flex items-center gap-2 text-gray-500 font-medium px-4 py-2 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {(q?.kind === "multi" || q?.kind === "text" || answers[q?.id ?? ""] === "Other") && (
            <button
              onClick={goNext}
              disabled={!canContinue()}
              className={`flex items-center gap-2 font-medium px-6 py-2.5 rounded-full transition-colors text-sm ${
                canContinue() ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {index === TOTAL - 1 ? "Finish" : "Continue"}
              {index !== TOTAL - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
