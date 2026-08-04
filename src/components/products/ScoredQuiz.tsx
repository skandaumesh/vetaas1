"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft, X, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

export type SQOption = { label: string; value: number };
export type SQQuestion = {
  id: string;
  section: string;
  accent: string;
  text: string;
  options: SQOption[];
};
export type SQBand = { min: number; label: string; blurb: string };

export type ScoredQuizProps = {
  quizId: string;
  quizName: string;
  introTitle: string;
  introText: string;
  accent: string;
  icon: React.ReactNode;
  questions: SQQuestion[];
  bands: SQBand[]; // any order; highest matching `min` wins
  scoreNoun?: string; // e.g. "reflection score" — used in result copy
  cta?: { href: string; label: string };
};

export default function ScoredQuiz({
  quizId,
  quizName,
  introTitle,
  introText,
  accent,
  icon,
  questions,
  bands,
  scoreNoun = "score",
  cta = { href: "/services#membership", label: "Explore our programs" },
}: ScoredQuizProps) {
  const TOTAL = questions.length;
  // -1 intro · 0..TOTAL-1 questions · TOTAL email capture · TOTAL+1 results
  const [index, setIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, SQOption>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const q = index >= 0 && index < TOTAL ? questions[index] : null;
  const started = index >= 0;

  // While the quiz is full-screen, lock the page so nothing scrolls behind it.
  // Lock both <html> and <body> — depending on the browser either can be the
  // scroll container, so hiding just one still leaves a scrollbar.
  useEffect(() => {
    if (!started) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [started]);

  const goNext = () => setIndex((i) => Math.min(TOTAL + 1, i + 1));
  const goBack = () => setIndex((i) => Math.max(-1, i - 1));

  const select = (question: SQQuestion, opt: SQOption) => {
    setAnswers((prev) => ({ ...prev, [question.id]: opt }));
    // Auto-advance, but never skip past the email-capture step
    setTimeout(() => setIndex((i) => Math.min(TOTAL, i + 1)), 260);
  };

  // ---- Scoring ----
  const totalScore = questions.reduce((s, question) => s + (answers[question.id]?.value ?? 0), 0);
  const maxScore = questions.reduce((s, question) => s + Math.max(...question.options.map((o) => o.value)), 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const band =
    [...bands].sort((a, b) => b.min - a.min).find((b) => percentage >= b.min) ?? bands[bands.length - 1];

  // Per-section breakdown (only shown when there is more than one section)
  const sectionNames = [...new Set(questions.map((question) => question.section))];
  const sections = sectionNames.map((title) => {
    const qs = questions.filter((question) => question.section === title);
    const score = qs.reduce((s, question) => s + (answers[question.id]?.value ?? 0), 0);
    const max = qs.reduce((s, question) => s + Math.max(...question.options.map((o) => o.value)), 0);
    return {
      title,
      accent: qs[0].accent,
      score,
      max,
      pct: max > 0 ? Math.round((score / max) * 100) : 0,
    };
  });

  const emailValid = /.+@.+\..+/.test(email.trim());
  const nameValid = name.trim().length > 0;
  const canSubmit = nameValid && emailValid;

  const submit = () => {
    if (!canSubmit || emailStatus === "sending") return;
    setEmailStatus("sending");
    goNext(); // reveal the result right away — don't make them wait on the network
    (async () => {
      try {
        if (!auth.currentUser) {
          try { await signInAnonymously(auth); } catch {}
        }
        await addDoc(collection(db, "quizSubmissions"), {
          quizId,
          quizName,
          name: name.trim(),
          email: email.trim(),
          score: totalScore,
          maxScore,
          percentage,
          band: band.label,
          bandBlurb: band.blurb,
          sections: sections.map((s) => ({ title: s.title, score: s.score, max: s.max, pct: s.pct })),
          answers: questions.map((question) => ({
            question: question.text,
            answer: answers[question.id]?.label ?? "—",
          })),
          createdAt: serverTimestamp(),
        });
        setEmailStatus("sent");
      } catch {
        setEmailStatus("error");
      }
    })();
  };

  const variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.32, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
  };

  const progressPct = index < 0 ? 0 : Math.round((Math.min(index, TOTAL) / TOTAL) * 100);

  return (
    <div
      className={`flex flex-col items-center px-4 bg-[#FAFAFA] font-[family-name:var(--font-poppins)] ${
        started
          ? "fixed inset-0 z-[100] py-6 overflow-y-auto"
          : "relative w-full pt-2 pb-10 overflow-hidden min-h-[80vh]"
      }`}
    >
      <div className="absolute top-[15%] left-[8%] w-[45vw] h-[45vw] max-w-[560px] max-h-[560px] rounded-full bg-gradient-to-tr from-[#7C3AED]/5 to-[#00CDBA]/5 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[8%] right-[5%] w-[38vw] h-[38vw] max-w-[480px] max-h-[480px] rounded-full bg-gradient-to-bl from-[#FF5C7A]/5 to-[#FFC107]/5 blur-[120px] pointer-events-none z-0" />

      {/* Exit full-screen */}
      {started && index <= TOTAL && (
        <Link
          href="/products"
          aria-label="Exit assessment"
          className="fixed top-5 right-5 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm transition-colors"
        >
          <X size={18} />
        </Link>
      )}

      {/* Progress */}
      {index >= 0 && index <= TOTAL && (
        <div className="w-full max-w-2xl mx-auto mb-8 relative z-10">
          <div className="flex justify-between text-xs font-bold mb-2" style={{ color: accent }}>
            <span>{index < TOTAL ? `Question ${index + 1} of ${TOTAL}` : "Almost done"}</span>
            <span className="bg-white px-3 py-0.5 rounded-full shadow-sm">{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-[#00CDBA] transition-all duration-500" style={{ width: `${Math.max(2, progressPct)}%` }} />
          </div>
        </div>
      )}

      <div className={`w-full max-w-2xl relative z-10 flex-1 flex flex-col ${started ? "justify-center" : "justify-start pt-2"}`}>
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {index === -1 && (
            <motion.div key="intro" variants={variants} initial="hidden" animate="visible" exit="exit" className="text-center py-10">
              <div className="inline-block p-4 bg-white border border-gray-100 rounded-full mb-6 shadow-sm">
                {icon}
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold font-headline mb-6 tracking-tight text-gray-900">
                {introTitle}
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
                {introText}
              </p>
              <button
                onClick={goNext}
                className="text-white font-medium py-3.5 px-8 rounded-full text-base transition-all hover:shadow-lg hover:brightness-105 inline-flex items-center gap-2"
                style={{ backgroundColor: accent }}
              >
                Start · {TOTAL} quick questions <ChevronRight className="w-4 h-4" />
              </button>
              <div className="mt-8">
                <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#7C3AED] transition-colors">
                  <ArrowLeft size={16} /> All assessments
                </Link>
              </div>
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
              <div className="flex flex-col gap-3">
                {q.options.map((opt) => {
                  const selected = answers[q.id]?.label === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => select(q, opt)}
                      className={`w-full text-left px-5 py-3.5 rounded-2xl text-base font-medium border-2 transition-all flex items-center justify-between ${
                        selected ? "text-white shadow-sm" : "bg-white border-gray-100 text-gray-700 hover:border-gray-300"
                      }`}
                      style={selected ? { backgroundColor: q.accent, borderColor: q.accent } : undefined}
                    >
                      {opt.label}
                      {selected && <CheckCircle2 size={18} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* EMAIL CAPTURE */}
          {index === TOTAL && (
            <motion.div key="email" variants={variants} initial="hidden" animate="visible" exit="exit" className="py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 text-white shadow-sm" style={{ backgroundColor: accent }}>
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Where should we send your result?</h2>
              <p className="text-gray-500 font-medium mb-8">
                Enter your email and we&apos;ll send your {scoreNoun} with a few gentle next steps.
              </p>
              <div className="flex flex-col gap-4 max-w-md">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 text-base bg-white focus:outline-none focus:border-[#7C3AED]"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 text-base bg-white focus:outline-none focus:border-[#7C3AED]"
                />
                <button
                  onClick={submit}
                  disabled={!canSubmit}
                  className={`inline-flex items-center justify-center gap-2 font-medium px-6 py-3.5 rounded-full transition-all text-base ${
                    canSubmit ? "text-white shadow-sm hover:brightness-105" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  style={canSubmit ? { backgroundColor: accent } : undefined}
                >
                  See my result <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-400">We&apos;ll only use this to send your result. No spam.</p>
              </div>
            </motion.div>
          )}

          {/* RESULTS */}
          {index === TOTAL + 1 && (
            <motion.div key="results" variants={variants} initial="hidden" animate="visible" exit="exit" className="text-center py-1">
              {/* Score ring */}
              <div className="relative inline-flex items-center justify-center mb-3">
                <svg width="112" height="112" viewBox="0 0 150 150" className="-rotate-90">
                  <circle cx="75" cy="75" r="66" fill="none" stroke="#eef0f2" strokeWidth="12" />
                  <circle
                    cx="75" cy="75" r="66" fill="none" stroke={accent} strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 66}
                    strokeDashoffset={2 * Math.PI * 66 * (1 - percentage / 100)}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-gray-900">{percentage}%</span>
                  <span className="text-[11px] font-semibold text-gray-400">{totalScore}/{maxScore}</span>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1.5">{band.label}</h2>
              <p className="text-sm text-gray-500 font-medium max-w-xl mx-auto mb-5">{band.blurb}</p>

              {/* Section breakdown */}
              {sections.length > 1 && (
                <div className="max-w-md mx-auto text-left space-y-2 mb-5">
                  {sections.map((s) => (
                    <div key={s.title}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[13px] font-semibold text-gray-700">{s.title}</span>
                        <span className="text-[13px] font-bold" style={{ color: s.accent }}>{s.pct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(2, s.pct)}%`, backgroundColor: s.accent }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Email confirmation */}
              <div className="max-w-md mx-auto mb-5">
                {emailStatus === "sending" && (
                  <p className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-2.5">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending your result to {email.trim()}…
                  </p>
                )}
                {emailStatus === "sent" && (
                  <p className="text-[13px] font-medium text-[#00998c] bg-[#e7faf6] border border-[#00cdba]/30 rounded-2xl px-5 py-2.5">
                    ✓ We&apos;ve emailed your full result to <span className="font-bold">{email.trim()}</span>.
                  </p>
                )}
                {emailStatus === "error" && (
                  <p className="text-[13px] font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-2.5">
                    Your result is shown above. We couldn&apos;t email it just now — please screenshot it.
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
                <Link href={cta.href} className="flex-1 text-white font-medium text-sm py-3 px-6 rounded-full hover:brightness-105 transition-all" style={{ backgroundColor: accent }}>
                  {cta.label}
                </Link>
                <Link href="/products" className="flex-1 bg-white border border-gray-200 text-gray-800 font-medium text-sm py-3 px-6 rounded-full hover:bg-gray-50 transition-colors">
                  More assessments
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* NAV — Back only, during questions & email capture */}
      {index >= 0 && index <= TOTAL && (
        <div className="w-full max-w-2xl flex justify-between items-center relative z-20 mt-8 pt-5 border-t border-gray-200">
          <button onClick={goBack} className="flex items-center gap-2 text-gray-500 font-medium px-4 py-2 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs text-gray-400 pr-2">{quizName}</span>
        </div>
      )}
    </div>
  );
}
