"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/AdminGate";
import type { FormDoc, FormResponseDoc } from "@/lib/forms";
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Download,
  Inbox,
  Loader2,
  Trash2,
} from "lucide-react";

interface ResponseRow extends FormResponseDoc {
  id: string;
}

const fmtDateTime = (t?: { seconds: number }) =>
  t
    ? new Date(t.seconds * 1000).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export default function FormResponsesPage() {
  const { user } = useAdminAuth();
  const params = useParams();
  const formId = params.formId as string;

  const [form, setForm] = useState<(FormDoc & { id: string }) | null>(null);
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const [formSnap, responsesSnap] = await Promise.all([
          getDoc(doc(db, "forms", formId)),
          getDocs(query(collection(db, "formResponses"), where("formId", "==", formId))),
        ]);
        if (formSnap.exists()) setForm({ id: formSnap.id, ...(formSnap.data() as FormDoc) });
        const rows = responsesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ResponseRow));
        rows.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setResponses(rows);
      } catch (err) {
        console.error("Failed to load responses:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, formId]);

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "formResponses", id));
    setResponses((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
  };

  const thisMonthCount = useMemo(() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    return responses.filter(
      (r) => r.createdAt && r.createdAt.seconds * 1000 >= monthStart.getTime()
    ).length;
  }, [responses]);

  const exportCsv = () => {
    if (!form) return;
    const headers = [...form.fields.map((f) => f.label || "Untitled question"), "Submitted at"];
    const rows = responses.map((r) => {
      const cells = form.fields.map((field) => {
        const answer = r.answers?.find((a) => a.fieldId === field.id);
        const value = answer?.value;
        return Array.isArray(value) ? value.join("; ") : value ?? "";
      });
      cells.push(fmtDateTime(r.createdAt));
      return cells.map((c) => csvEscape(String(c))).join(",");
    });
    const csv = [headers.map(csvEscape).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form.title || "form").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#7C3AED]" size={28} />
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 md:py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/forms"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={15} /> Forms
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827]">
              {form?.title || "Form"} — Responses
            </h1>
            <p className="text-sm text-slate-400">
              {responses.length} response{responses.length === 1 ? "" : "s"} · {thisMonthCount} this month
            </p>
          </div>
          <button
            onClick={exportCsv}
            disabled={responses.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 border border-white/70 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>

        {responses.length === 0 ? (
          <div className="text-center py-24">
            <Inbox className="mx-auto mb-3 text-gray-300" size={40} />
            <p className="text-slate-300">No responses yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {responses.map((r) => {
              const open = expanded === r.id;
              return (
                <div key={r.id} className="glass-card rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpanded(open ? null : r.id)}
                    className="w-full p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 font-semibold">
                        <Clock size={13} /> {fmtDateTime(r.createdAt)}
                      </span>
                      {r.paymentStatus && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            r.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {r.paymentStatus === "paid"
                            ? `Paid ₹${(r.amount ?? 0).toLocaleString("en-IN")}`
                            : "Payment not received"}
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-3">
                      {deleteConfirmId === r.id ? (
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(r.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 cursor-pointer"
                        >
                          <Trash2 size={13} /> Confirm
                        </span>
                      ) : (
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(r.id);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 cursor-pointer"
                          aria-label="Delete response"
                        >
                          <Trash2 size={14} />
                        </span>
                      )}
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-gray-100 bg-white/40 px-5 py-5 space-y-3">
                      {(r.answers ?? []).map((a, i) => {
                        const fieldType = form?.fields.find((f) => f.id === a.fieldId)?.type;
                        const isImage = fieldType === "image_upload" && typeof a.value === "string" && a.value;
                        return (
                          <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm border-b border-gray-100 pb-2">
                            <span className="text-gray-500">{a.label}</span>
                            {isImage ? (
                              <a href={a.value as string} target="_blank" rel="noopener noreferrer">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={a.value as string} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                              </a>
                            ) : (
                              <span className="font-semibold text-[#111827] sm:text-right">
                                {Array.isArray(a.value) ? a.value.join(", ") : a.value || "—"}
                              </span>
                            )}
                          </div>
                        );
                      })}
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
