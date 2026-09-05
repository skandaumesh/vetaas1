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
import type { FormDoc } from "@/lib/forms";
import {
  BarChart3,
  Check,
  Copy,
  FileText,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Trash2,
  Unlock,
} from "lucide-react";

interface FormRow extends FormDoc {
  id: string;
}

export default function AdminFormsPage() {
  const { user } = useAdminAuth();
  const router = useRouter();
  const [forms, setForms] = useState<FormRow[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const toggleStatus = async (form: FormRow) => {
    const nextStatus = form.status === "open" ? "closed" : "open";
    setForms((prev) => prev.map((f) => (f.id === form.id ? { ...f, status: nextStatus } : f)));
    await updateDoc(doc(db, "forms", form.id), { status: nextStatus, updatedAt: serverTimestamp() });
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "forms", id));
    setForms((prev) => prev.filter((f) => f.id !== id));
    setDeleteConfirmId(null);
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="glass-card rounded-2xl p-5 flex flex-col gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h2 className="font-extrabold text-[#111827] leading-snug">
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
                  {form.description && (
                    <p className="text-sm text-slate-400 line-clamp-2">{form.description}</p>
                  )}
                  <p className="text-xs text-gray-400 font-semibold mt-2">
                    {form.fields.length} field{form.fields.length === 1 ? "" : "s"} ·{" "}
                    {responseCounts[form.id] ?? 0} response{(responseCounts[form.id] ?? 0) === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                  <Link
                    href={`/admin/forms/${form.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border border-white/70 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                  <Link
                    href={`/admin/forms/${form.id}/responses`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border border-white/70 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors"
                  >
                    <BarChart3 size={13} /> Responses
                  </Link>
                  <button
                    onClick={() => copyLink(form.id)}
                    className="inline-flex items-center justify-center w-8 h-8 bg-white/60 border border-white/70 text-gray-500 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ml-auto"
                    aria-label="Copy share link"
                    title="Copy share link"
                  >
                    {copiedId === form.id ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                  </button>
                  {deleteConfirmId === form.id ? (
                    <button
                      onClick={() => remove(form.id)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                      aria-label="Confirm delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(form.id)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-white/60 border border-white/70 text-gray-400 rounded-full hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Delete form"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
