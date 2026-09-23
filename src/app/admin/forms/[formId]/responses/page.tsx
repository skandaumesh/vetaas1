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
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { db, functions, storage } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/AdminGate";
import { registrantEmail } from "@/lib/tickets";
import {
  fileNameFromPath,
  fileNameFromUrl,
  formatAnswer,
  isStoragePath,
  type FormDoc,
  type FormResponseDoc,
  type GridAnswer,
} from "@/lib/forms";
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Inbox,
  Loader2,
  Mail,
  Ticket,
  Trash2,
} from "lucide-react";

interface ResponseRow extends FormResponseDoc {
  id: string;
}

const sendRegistrationEmail = httpsCallable<
  { responseId: string },
  { sent: boolean; reason?: string; email?: string; ticketToken?: string | null }
>(functions, "sendRegistrationEmail");

const REASONS: Record<string, string> = {
  "no-email": "No email address in this response",
  unpaid: "Payment isn't complete",
  "not-found": "Response not found",
  "form-missing": "Form not found",
};

// Confirmed registrations that haven't been emailed yet.
const needsEmail = (r: ResponseRow) =>
  (!r.paymentStatus || r.paymentStatus === "paid") && !r.confirmationSentAt;

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
  const [emailStatus, setEmailStatus] = useState<Record<string, string>>({});
  const [bulk, setBulk] = useState<{ done: number; total: number } | null>(null);

  /** Returns true when the email was queued. */
  const sendEmail = async (r: ResponseRow) => {
    setEmailStatus((s) => ({ ...s, [r.id]: "sending" }));
    try {
      const { data } = await sendRegistrationEmail({ responseId: r.id });
      if (data.sent) {
        setEmailStatus((s) => ({ ...s, [r.id]: `Sent to ${data.email}` }));
        setResponses((prev) =>
          prev.map((row) =>
            row.id === r.id
              ? {
                  ...row,
                  confirmationTo: data.email,
                  confirmationSentAt: { seconds: Math.floor(Date.now() / 1000) },
                  ticketToken: data.ticketToken ?? row.ticketToken,
                }
              : row
          )
        );
        return true;
      }
      setEmailStatus((s) => ({ ...s, [r.id]: REASONS[data.reason ?? ""] ?? "Not sent" }));
    } catch (err) {
      console.error("Send email failed:", err);
      setEmailStatus((s) => ({ ...s, [r.id]: "Couldn't send. Try again." }));
    }
    return false;
  };

  const sendAll = async () => {
    const pending = responses.filter(needsEmail);
    if (pending.length === 0) return;
    if (!window.confirm(`Email ${pending.length} ${pending.length === 1 ? "person" : "people"} their confirmation${form && (form.eventDate || form.location) ? " and ticket" : ""}?`)) return;
    setBulk({ done: 0, total: pending.length });
    for (let i = 0; i < pending.length; i++) {
      await sendEmail(pending[i]);
      setBulk({ done: i + 1, total: pending.length });
    }
    window.setTimeout(() => setBulk(null), 2500);
  };

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
        return formatAnswer(value);
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
          <div className="flex flex-wrap items-center gap-2">
            {(bulk || responses.some(needsEmail)) && (
              <button
                onClick={sendAll}
                disabled={!!bulk}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] text-white rounded-full text-sm font-bold hover:bg-[#6D28D9] transition-colors disabled:opacity-70 cursor-pointer"
              >
                {bulk ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
                {bulk
                  ? `Sending ${bulk.done}/${bulk.total}`
                  : `Email ${responses.filter(needsEmail).length} not yet emailed`}
              </button>
            )}
            <button
              onClick={exportCsv}
              disabled={responses.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 border border-white/70 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Download size={15} /> Export CSV
            </button>
          </div>
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
                      {r.checkedInAt && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700">
                          Checked in
                        </span>
                      )}
                      {r.confirmationSentAt && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-50 text-violet-700">
                          <Mail size={11} /> Emailed
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
                      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-gray-100">
                        {(!r.paymentStatus || r.paymentStatus === "paid") && (
                          <button
                            onClick={() => sendEmail(r)}
                            disabled={emailStatus[r.id] === "sending"}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors disabled:opacity-60 cursor-pointer"
                          >
                            {emailStatus[r.id] === "sending" ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Mail size={13} />
                            )}
                            {r.confirmationSentAt ? "Resend email" : "Send confirmation email"}
                          </button>
                        )}
                        {r.ticketToken && (
                          <a
                            href={`/ticket/${r.ticketToken}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors"
                          >
                            <Ticket size={13} /> Open ticket
                          </a>
                        )}
                        <span className="text-xs text-gray-500">
                          {emailStatus[r.id] && emailStatus[r.id] !== "sending"
                            ? emailStatus[r.id]
                            : r.confirmationTo
                              ? `Last emailed to ${r.confirmationTo}`
                              : r.confirmationError === "no-email"
                                ? "No email address to send to"
                                : registrantEmail(r.answers) || r.payerEmail || ""}
                        </span>
                      </div>
                      {(r.payerEmail || r.payerPhone) && (
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-500">Contact from payment</span>
                          <span className="font-semibold text-[#111827] sm:text-right">
                            {[r.payerEmail, r.payerPhone].filter(Boolean).join(" · ")}
                          </span>
                        </div>
                      )}
                      {(r.answers ?? []).map((a, i) => {
                        const field = form?.fields.find((f) => f.id === a.fieldId);
                        const fieldType = field?.type;
                        const isImage = fieldType === "image_upload" && typeof a.value === "string" && a.value;
                        const isFile = fieldType === "file_upload" && typeof a.value === "string" && a.value;
                        const isGrid = !!a.value && typeof a.value === "object" && !Array.isArray(a.value);
                        return (
                          <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm border-b border-gray-100 pb-2">
                            <span className="text-gray-500">{a.label}</span>
                            {isImage ? (
                              <Uploaded value={a.value as string} image />
                            ) : isFile ? (
                              <Uploaded value={a.value as string} />
                            ) : isGrid ? (
                              <dl className="space-y-0.5 sm:text-right">
                                {Object.entries(a.value as GridAnswer).map(([row, cell]) => (
                                  <div key={row}>
                                    <dt className="inline text-gray-500">{row}: </dt>
                                    <dd className="inline font-semibold text-[#111827]">
                                      {Array.isArray(cell) ? cell.join(", ") : cell}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            ) : fieldType === "rating" && typeof a.value === "string" && a.value ? (
                              <span className="font-semibold text-[#111827] sm:text-right">
                                <span className="text-amber-400">{"★".repeat(Number(a.value) || 0)}</span>{" "}
                                <span className="text-gray-400">
                                  {a.value}/{field?.ratingMax ?? 5}
                                </span>
                              </span>
                            ) : (
                              <span className="font-semibold text-[#111827] sm:text-right">
                                {formatAnswer(a.value) || "—"}
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

/**
 * An uploaded answer. Newer responses hold a storage path, which only an admin
 * can open, so the link is fetched here; older ones hold a download URL.
 */
function Uploaded({ value, image = false }: { value: string; image?: boolean }) {
  const [url, setUrl] = useState(isStoragePath(value) ? "" : value);
  const name = isStoragePath(value) ? fileNameFromPath(value) : fileNameFromUrl(value);

  useEffect(() => {
    // A plain URL is already in state from the initial value.
    if (!isStoragePath(value)) return;
    let live = true;
    getDownloadURL(storageRef(storage, value))
      .then((u) => live && setUrl(u))
      .catch((err) => console.error("Could not open upload:", err));
    return () => {
      live = false;
    };
  }, [value]);

  if (!url) {
    return (
      <span className="inline-flex items-center gap-1.5 text-gray-400 text-xs sm:text-right">
        <Loader2 size={13} className="animate-spin" /> {name}
      </span>
    );
  }

  if (image) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-semibold text-[#7C3AED] hover:underline break-all sm:text-right"
    >
      <FileText size={14} className="shrink-0" />
      {name}
    </a>
  );
}
