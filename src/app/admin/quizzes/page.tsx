"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/AdminGate";
import { ChevronRight, Loader2, Trash2 } from "lucide-react";

interface SectionScore {
  title: string;
  score: number;
  max: number;
  pct: number;
}
interface QuizAnswer {
  question: string;
  answer: string;
}
interface Submission {
  id: string;
  quizId: string;
  quizName: string;
  name: string;
  email: string;
  score: number;
  maxScore: number;
  percentage: number;
  band?: string;
  sections?: SectionScore[];
  answers?: QuizAnswer[];
  createdAt?: { seconds: number };
  emailedAt?: { seconds: number };
}

const fmtDateTime = (t?: { seconds: number }) =>
  t
    ? new Date(t.seconds * 1000).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

const pctColor = (p: number) => (p >= 80 ? "#16a34a" : p >= 55 ? "#7C3AED" : "#f59e0b");

export default function AdminQuizzesPage() {
  const { user } = useAdminAuth();
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizFilter, setQuizFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(db, "quizSubmissions"), orderBy("createdAt", "desc"))
        );
        setSubs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission)));
      } catch (err) {
        console.error("Failed to load quiz submissions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "quizSubmissions", id));
    setSubs((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirmId(null);
  };

  // Distinct quizzes present, for the filter chips
  const quizzes = useMemo(() => {
    const map = new Map<string, string>();
    subs.forEach((s) => map.set(s.quizId, s.quizName));
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [subs]);

  const visible = subs.filter((s) => quizFilter === "all" || s.quizId === quizFilter);

  // Stats
  const total = subs.length;
  const uniquePeople = new Set(subs.map((s) => s.email.toLowerCase())).size;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const thisMonth = subs.filter(
    (s) => s.createdAt && s.createdAt.seconds * 1000 >= monthStart.getTime()
  ).length;
  const avgScore = subs.length
    ? Math.round(subs.reduce((sum, s) => sum + (s.percentage || 0), 0) / subs.length)
    : 0;

  return (
    <main className="min-h-screen py-8 md:py-10 px-4 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-[2.15rem] font-semibold tracking-[-0.02em] text-slate-900">
              Quiz <span className="text-slate-300">submissions</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Everyone who completed a self-assessment — their name, email and result.
            </p>
          </div>
          <div className="text-sm text-slate-400 tabular-nums">
            {total} submission{total === 1 ? "" : "s"} total
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden mb-8">
          {[
            { label: "Total attempts", value: String(total), sub: `${thisMonth} this month` },
            { label: "Unique people", value: String(uniquePeople), sub: "by email address" },
            { label: "Average score", value: `${avgScore}%`, sub: "across all quizzes" },
            { label: "Quizzes live", value: String(quizzes.length), sub: "with responses" },
          ].map((card) => (
            <div key={card.label} className="bg-white px-5 py-5">
              <p className="text-[13px] font-medium text-slate-400 mb-3">{card.label}</p>
              <p className="text-[2.5rem] font-semibold tabular-nums tracking-[-0.03em] leading-none mb-2 text-slate-900">
                {card.value}
              </p>
              <p className="text-xs text-slate-300">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="inline-flex bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setQuizFilter("all")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                quizFilter === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All
              <span className="text-slate-400 tabular-nums">{total}</span>
            </button>
            {quizzes.map((q) => {
              const count = subs.filter((s) => s.quizId === q.id).length;
              return (
                <button
                  key={q.id}
                  onClick={() => setQuizFilter(q.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                    quizFilter === q.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {q.name}
                  <span className="text-slate-400 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="glass-solid rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-slate-300" size={24} />
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm text-slate-400">No quiz submissions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-white/40">
                    {["Person", "Quiz", "Score", "Result", "Submitted", ""].map((h, i) => (
                      <th
                        key={i}
                        className="text-left font-medium text-slate-500 text-xs uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s) => {
                    const open = expanded === s.id;
                    const hasDetail = !!(s.answers?.length || s.sections?.length);
                    return (
                      <Fragment key={s.id}>
                        <tr
                          onClick={() => hasDetail && setExpanded(open ? null : s.id)}
                          className={`border-b border-slate-100 transition-colors ${
                            hasDetail ? "cursor-pointer" : ""
                          } ${open ? "bg-slate-50" : "hover:bg-slate-50/60"}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <ChevronRight
                                size={14}
                                className={`shrink-0 transition-transform ${
                                  hasDetail ? "text-slate-300" : "text-transparent"
                                } ${open ? "rotate-90" : ""}`}
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-slate-900 truncate">{s.name || "—"}</p>
                                <a
                                  href={`mailto:${s.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs text-slate-500 hover:text-violet-600 truncate block"
                                >
                                  {s.email}
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-600">{s.quizName}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className="font-semibold tabular-nums"
                                style={{ color: pctColor(s.percentage) }}
                              >
                                {s.percentage}%
                              </span>
                              <span className="text-xs text-slate-400 tabular-nums">
                                {s.score}/{s.maxScore}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-600 text-[13px]">
                            {s.band || "—"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-xs">
                            {fmtDateTime(s.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            {deleteConfirmId === s.id ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  remove(s.id);
                                }}
                                className="px-2.5 py-1 bg-rose-600 text-white rounded-md text-xs font-medium hover:bg-rose-700 cursor-pointer"
                              >
                                Confirm
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmId(s.id);
                                }}
                                className="inline-flex items-center justify-center w-7 h-7 text-slate-300 hover:text-rose-600 cursor-pointer"
                                aria-label="Delete submission"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>

                        {open && (
                          <tr className="border-b border-slate-100 bg-slate-50">
                            <td colSpan={6} className="px-4 pb-5 pt-1">
                              <div className="pl-6 space-y-5">
                                {s.sections && s.sections.length > 1 && (
                                  <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-3">
                                      Breakdown
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl">
                                      {s.sections.map((sec) => (
                                        <div key={sec.title}>
                                          <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-600">{sec.title}</span>
                                            <span className="text-slate-400 tabular-nums">
                                              {sec.pct}%
                                            </span>
                                          </div>
                                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                            <div
                                              className="h-full rounded-full bg-violet-500"
                                              style={{ width: `${Math.max(3, sec.pct)}%` }}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {s.answers && s.answers.length > 0 && (
                                  <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-2">
                                      Answers
                                    </p>
                                    <div className="max-w-3xl">
                                      {s.answers.map((a, i) => (
                                        <div
                                          key={i}
                                          className="flex flex-col sm:flex-row sm:justify-between gap-1 text-[13px] border-b border-slate-200 py-2"
                                        >
                                          <span className="text-slate-500">{a.question}</span>
                                          <span className="font-medium text-slate-900 sm:text-right shrink-0">
                                            {a.answer}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
