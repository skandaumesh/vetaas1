"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  ChevronDown,
  ClipboardList,
  Clock,
  Loader2,
  Mail,
  Trash2,
  User,
  Users,
} from "lucide-react";

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
    <main className="min-h-screen bg-gray-50 py-8 md:py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827]">
            Quiz Submissions
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Everyone who completed a self-assessment — their name, email and result.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total attempts",
              value: String(total),
              sub: `${thisMonth} this month`,
              icon: <ClipboardList size={18} className="text-[#7C3AED]" />,
              iconBg: "bg-[#7C3AED]/10",
            },
            {
              label: "Unique people",
              value: String(uniquePeople),
              sub: "by email address",
              icon: <Users size={18} className="text-[#00998c]" />,
              iconBg: "bg-[#00cdba]/15",
            },
            {
              label: "Average score",
              value: `${avgScore}%`,
              sub: "across all quizzes",
              icon: <User size={18} className="text-[#268bff]" />,
              iconBg: "bg-blue-100",
            },
            {
              label: "Quizzes live",
              value: String(quizzes.length),
              sub: "with responses",
              icon: <Mail size={18} className="text-[#d97706]" />,
              iconBg: "bg-amber-100",
            },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <span className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  {card.icon}
                </span>
                <span className="text-xs font-bold text-gray-500">{card.label}</span>
              </div>
              <p className="text-2xl font-extrabold text-[#111827] leading-none mb-1.5">
                {card.value}
              </p>
              <p className="text-[11px] text-gray-400 font-semibold">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Per-quiz counts + filter */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setQuizFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer ${
              quizFilter === "all"
                ? "bg-[#111827] text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
            }`}
          >
            All ({total})
          </button>
          {quizzes.map((q) => {
            const count = subs.filter((s) => s.quizId === q.id).length;
            return (
              <button
                key={q.id}
                onClick={() => setQuizFilter(q.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  quizFilter === q.id
                    ? "bg-[#7C3AED] text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {q.name} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-[#7C3AED]" size={28} />
          </div>
        ) : visible.length === 0 ? (
          <p className="text-center text-gray-400 font-medium py-24">
            No quiz submissions yet.
          </p>
        ) : (
          <div className="space-y-3">
            {visible.map((s) => {
              const open = expanded === s.id;
              const color = pctColor(s.percentage);
              return (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                    {/* Score badge */}
                    <div
                      className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: color }}
                    >
                      <span className="text-lg font-extrabold leading-none">{s.percentage}%</span>
                    </div>

                    {/* Identity */}
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-1">
                        <span className="font-extrabold text-[#111827]">{s.name || "—"}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#7C3AED]">
                          {s.quizName}
                        </span>
                        {s.band && (
                          <span className="text-xs font-semibold text-gray-500">{s.band}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                        <a href={`mailto:${s.email}`} className="inline-flex items-center gap-1.5 hover:text-[#7C3AED]">
                          <Mail size={13} /> {s.email}
                        </a>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} /> {fmtDateTime(s.createdAt)}
                        </span>
                        <span className="text-gray-400">
                          {s.score}/{s.maxScore}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {(s.answers?.length || s.sections?.length) && (
                        <button
                          onClick={() => setExpanded(open ? null : s.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          Details
                          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>
                      )}
                      {deleteConfirmId === s.id ? (
                        <button
                          onClick={() => remove(s.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-all cursor-pointer"
                        >
                          <Trash2 size={14} /> Confirm
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(s.id)}
                          className="inline-flex items-center justify-center w-9 h-9 bg-white border border-gray-200 text-gray-400 rounded-full hover:text-red-500 transition-all cursor-pointer"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {open && (
                    <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-5 space-y-5">
                      {s.sections && s.sections.length > 1 && (
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl">
                          {s.sections.map((sec) => (
                            <div key={sec.title}>
                              <div className="flex justify-between text-xs font-semibold mb-1">
                                <span className="text-gray-600">{sec.title}</span>
                                <span className="text-gray-500">{sec.pct}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full rounded-full bg-[#7C3AED]" style={{ width: `${Math.max(3, sec.pct)}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {s.answers && s.answers.length > 0 && (
                        <div className="space-y-2 max-w-3xl">
                          {s.answers.map((a, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm border-b border-gray-100 pb-2">
                              <span className="text-gray-500">{a.question}</span>
                              <span className="font-semibold text-[#111827] sm:text-right shrink-0">{a.answer}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
