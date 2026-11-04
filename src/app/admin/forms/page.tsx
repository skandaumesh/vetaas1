"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/AdminGate";
import PasswordConfirmDialog from "@/components/admin/PasswordConfirmDialog";
import type { FormDoc } from "@/lib/forms";
import {
  BarChart3,
  CalendarDays,
  Check,
  Copy,
  CopyPlus,
  FileText,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Trash2,
  Unlock,
} from "lucide-react";

const ACTION =
  "inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full bg-slate-50 " +
  "border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 " +
  "transition-colors cursor-pointer disabled:opacity-60";
const ICON_ACTION =
  "inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-slate-50 " +
  "border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer";

interface FormRow extends FormDoc {
  id: string;
}

type SortMode = "event" | "edited";
const SORT_KEY = "adminFormsSort";
const SORTS: { key: SortMode; label: string }[] = [
  { key: "event", label: "Event date" },
  { key: "edited", label: "Last edited" },
];

/** Today in India, as "2026-11-04", to compare against event dates. */
const istToday = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** The form's event date as "2026-11-15", or "" when it has none. */
const eventDay = (form: FormRow) => {
  const d = form.eventDate?.trim() ?? "";
  return DATE_RE.test(d) ? d : "";
};

/** "Sat, 15 Nov 2026" from "2026-11-15". */
function shortDay(iso: string): string {
  const m = DATE_RE.exec(iso);
  if (!m) return "";
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))).toLocaleDateString(
    "en-IN",
    { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" }
  );
}

const byStart = (a: FormRow, b: FormRow) => (a.eventStart ?? "").localeCompare(b.eventStart ?? "");

export default function AdminFormsPage() {
  const { user } = useAdminAuth();
  const router = useRouter();
  const [forms, setForms] = useState<FormRow[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FormRow | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("event");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SORT_KEY);
      if (saved === "event" || saved === "edited") setSort(saved);
    } catch {}
  }, []);

  const changeSort = (next: SortMode) => {
    setSort(next);
    try {
      localStorage.setItem(SORT_KEY, next);
    } catch {}
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const [formsSnap, responsesSnap] = await Promise.all([
          getDocs(query(collection(db, "forms"), orderBy("updatedAt", "desc"))),
          getDocs(collection(db, "formResponses")),
        ]);
        setForms(formsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as FormRow)));
        const counts: Record<string, number> = {};
        responsesSnap.docs.forEach((d) => {
          const formId = d.data().formId as string;
          counts[formId] = (counts[formId] ?? 0) + 1;
        });
        setResponseCounts(counts);
      } catch (err) {
        console.error("Failed to load forms:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const createForm = async () => {
    setCreating(true);
    try {
      const ref = await addDoc(collection(db, "forms"), {
        title: "Untitled form",
        description: "",
        fields: [],
        status: "open",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push(`/admin/forms/${ref.id}/edit`);
    } catch (err) {
      console.error("Failed to create form:", err);
      setCreating(false);
    }
  };

  /**
   * Run the same session again without rebuilding it: everything comes across
   * except the date, which belongs to the new occurrence. The copy starts
   * closed so it can't take registrations before it's ready.
   */
  const duplicate = async (form: FormRow) => {
    setDuplicatingId(form.id);
    try {
      const ref = await addDoc(collection(db, "forms"), {
        title: `${form.title || "Untitled form"} (copy)`,
        description: form.description ?? "",
        fields: form.fields ?? [],
        status: "closed",
        logoUrl: form.logoUrl ?? "",
        limitOneResponse: form.limitOneResponse ?? false,
        eventDate: "",
        eventStart: form.eventStart ?? "",
        eventEnd: form.eventEnd ?? "",
        location: form.location ?? "",
        locationNote: form.locationNote ?? "",
        mapUrl: form.mapUrl ?? "",
        hostName: form.hostName ?? "",
        ctaLabel: form.ctaLabel ?? "",
        price: form.price ?? 0,
        ...(typeof form.confirmationEmail === "boolean"
          ? { confirmationEmail: form.confirmationEmail }
          : {}),
        emailSubject: form.emailSubject ?? "",
        emailMessage: form.emailMessage ?? "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      try {
        sessionStorage.setItem("formJustCopied:" + ref.id, "1");
      } catch {}
      router.push(`/admin/forms/${ref.id}/edit`);
    } catch (err) {
      console.error("Failed to duplicate form:", err);
      setDuplicatingId(null);
    }
  };

  const toggleStatus = async (form: FormRow) => {
    const nextStatus = form.status === "open" ? "closed" : "open";
    setForms((prev) => prev.map((f) => (f.id === form.id ? { ...f, status: nextStatus } : f)));
    await updateDoc(doc(db, "forms", form.id), { status: nextStatus, updatedAt: serverTimestamp() });
  };

  // Runs only after PasswordConfirmDialog has verified the admin's password.
  const remove = async (id: string) => {
    await deleteDoc(doc(db, "forms", id));
    setForms((prev) => prev.filter((f) => f.id !== id));
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/forms/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1800);
    });
  };

  const totalResponses = useMemo(
    () => Object.values(responseCounts).reduce((s, n) => s + n, 0),
    [responseCounts]
  );

  // By event date: upcoming soonest first, then past most recent first, then
  // forms with no date (plain forms and fresh copies) by last edit.
  const groups = useMemo(() => {
    if (sort === "edited") return [{ key: "all", label: "", dot: "", forms }];
    const today = istToday();
    const upcoming: FormRow[] = [];
    const past: FormRow[] = [];
    const undated: FormRow[] = [];
    for (const f of forms) {
      const d = eventDay(f);
      if (!d) undated.push(f);
      else if (d >= today) upcoming.push(f);
      else past.push(f);
    }
    upcoming.sort((a, b) => eventDay(a).localeCompare(eventDay(b)) || byStart(a, b));
    past.sort((a, b) => eventDay(b).localeCompare(eventDay(a)) || byStart(a, b));
    return [
      { key: "upcoming", label: "Upcoming", dot: "bg-green-500", forms: upcoming },
      { key: "past", label: "Past", dot: "bg-slate-300", forms: past },
      { key: "undated", label: "No event date", dot: "bg-slate-200", forms: undated },
    ].filter((g) => g.forms.length > 0);
  }, [forms, sort]);

  const renderCard = (form: FormRow) => {
    const day = eventDay(form);
    return (
      <div key={form.id} className="glass-card rounded-2xl p-5 flex flex-col gap-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h2 className="min-w-0 font-extrabold text-[#111827] leading-snug break-words">
              {form.title || "Untitled form"}
            </h2>
            <button
              onClick={() => toggleStatus(form)}
              title={form.status === "open" ? "Accepting responses — click to close" : "Closed — click to reopen"}
              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                form.status === "open"
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {form.status === "open" ? <Unlock size={11} /> : <Lock size={11} />}
              {form.status}
            </button>
          </div>
          {day && (
            <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] mb-1.5">
              <CalendarDays size={13} />
              {shortDay(day)}
            </p>
          )}
          {form.description && (
            <p className="text-sm text-slate-400 line-clamp-2">{form.description}</p>
          )}
          <p className="text-xs text-gray-400 font-semibold mt-2">
            {form.fields.length} field{form.fields.length === 1 ? "" : "s"} ·{" "}
            {responseCounts[form.id] ?? 0} response{(responseCounts[form.id] ?? 0) === 1 ? "" : "s"}
          </p>
        </div>

        {/* Two full-width rows of equal-height controls, so the
            footers line up across cards at any screen width. */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Link href={`/admin/forms/${form.id}/edit`} className={ACTION}>
              <Pencil size={13} /> Edit
            </Link>
            <Link href={`/admin/forms/${form.id}/responses`} className={ACTION}>
              <BarChart3 size={13} /> Responses
            </Link>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => duplicate(form)}
              disabled={duplicatingId === form.id}
              title="Make a copy for the next time you run this"
              className={`${ACTION} flex-1`}
            >
              {duplicatingId === form.id ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <CopyPlus size={13} />
              )}
              Duplicate
            </button>
            <button
              onClick={() => copyLink(form.id)}
              className={ICON_ACTION}
              aria-label="Copy share link"
              title="Copy share link"
            >
              {copiedId === form.id ? (
                <Check size={13} className="text-green-600" />
              ) : (
                <Copy size={13} />
              )}
            </button>
            <button
              onClick={() => setDeleteTarget(form)}
              className={`${ICON_ACTION} hover:text-red-500`}
              aria-label="Delete form"
              title="Delete form"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen py-8 md:py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-[2.15rem] font-semibold tracking-[-0.02em] text-slate-900">Forms <span className="text-slate-300">builder</span></h1>
            <p className="text-sm text-slate-400">
              Build your own forms and share the link — {forms.length} form{forms.length === 1 ? "" : "s"},{" "}
              {totalResponses} response{totalResponses === 1 ? "" : "s"} total.
            </p>
          </div>
          <button
            onClick={createForm}
            disabled={creating}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] text-white rounded-full text-sm font-bold hover:bg-[#6D28D9] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            New form
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-[#7C3AED]" size={28} />
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-24">
            <FileText className="mx-auto mb-3 text-gray-300" size={40} />
            <p className="text-slate-300">No forms yet — create your first one.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[13px] font-medium text-slate-400">Sort by</span>
              <div className="inline-flex bg-slate-100 rounded-lg p-0.5">
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => changeSort(s.key)}
                    aria-pressed={sort === s.key}
                    className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                      sort === s.key
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              {groups.map((g) => (
                <section key={g.key}>
                  {g.label && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`w-2 h-2 rounded-full ${g.dot}`} />
                      <h3 className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        {g.label}
                      </h3>
                      <span className="text-xs text-slate-400 tabular-nums">{g.forms.length}</span>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {g.forms.map(renderCard)}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>

      <PasswordConfirmDialog
        open={deleteTarget !== null}
        title="Delete this form?"
        message={
          <>
            <span className="font-semibold text-slate-700">
              {deleteTarget?.title || "Untitled form"}
            </span>{" "}
            will be permanently deleted and its link will stop working. Enter your admin password to
            confirm.
          </>
        }
        confirmLabel="Delete form"
        onConfirm={() => (deleteTarget ? remove(deleteTarget.id) : Promise.resolve())}
        onClose={() => setDeleteTarget(null)}
      />
    </main>
  );
}
