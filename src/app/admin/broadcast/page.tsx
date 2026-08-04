"use client";

import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/AdminGate";
import {
  buildBroadcastHtml,
  buildBroadcastText,
  personalize,
} from "@/lib/broadcastEmail";
import {
  CheckCircle2,
  Loader2,
  Mail,
  Send,
  Users,
} from "lucide-react";

type Contact = { name: string; email: string; source: "member" | "quiz" };

const DEFAULT_BODY =
  "Hi {{name}},\n\nWe have some exciting news to share with you...\n\nWarm regards,\nTeam Vetaas";

// Split a textarea of "Name <email>" / "email" lines into contacts.
function parseManual(text: string): Contact[] {
  return text
    .split(/[\n,]+/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const m = raw.match(/^(.*?)<(.+?)>$/);
      if (m) return { name: m[1].trim(), email: m[2].trim(), source: "member" as const };
      return { name: "", email: raw, source: "member" as const };
    })
    .filter((c) => /.+@.+\..+/.test(c.email));
}

export default function AdminBroadcastPage() {
  const { user } = useAdminAuth();
  const [members, setMembers] = useState<Contact[]>([]);
  const [quizContacts, setQuizContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const [useMembers, setUseMembers] = useState(true);
  const [useQuiz, setUseQuiz] = useState(true);
  const [manual, setManual] = useState("");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(DEFAULT_BODY);

  const [confirm, setConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const [orderSnap, quizSnap] = await Promise.all([
          getDocs(collection(db, "membershipOrders")),
          getDocs(collection(db, "quizSubmissions")),
        ]);
        setMembers(
          orderSnap.docs
            .map((d) => d.data())
            .filter((o) => o.email)
            .map((o) => ({ name: o.parentName || "", email: String(o.email), source: "member" as const }))
        );
        setQuizContacts(
          quizSnap.docs
            .map((d) => d.data())
            .filter((q) => q.email)
            .map((q) => ({ name: q.name || "", email: String(q.email), source: "quiz" as const }))
        );
      } catch (err) {
        console.error("Failed to load contacts:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Merge selected sources, dedupe by email (keep the first name we find)
  const recipients = useMemo(() => {
    const pool: Contact[] = [
      ...(useMembers ? members : []),
      ...(useQuiz ? quizContacts : []),
      ...parseManual(manual),
    ];
    const map = new Map<string, Contact>();
    for (const c of pool) {
      const key = c.email.toLowerCase();
      const existing = map.get(key);
      if (!existing) map.set(key, c);
      else if (!existing.name && c.name) map.set(key, { ...existing, name: c.name });
    }
    return [...map.values()];
  }, [members, quizContacts, useMembers, useQuiz, manual]);

  const preview = recipients[0] ?? { name: "Asha", email: "asha@example.com", source: "member" as const };
  const canSend = subject.trim().length > 0 && body.trim().length > 0 && recipients.length > 0;

  const send = async () => {
    if (!canSend || sending) return;
    setSending(true);
    setError("");
    setProgress(0);
    const batchId = `bc-${Date.now()}`;
    let done = 0;
    try {
      const chunkSize = 20;
      for (let i = 0; i < recipients.length; i += chunkSize) {
        const chunk = recipients.slice(i, i + chunkSize);
        await Promise.all(
          chunk.map((c) =>
            addDoc(collection(db, "mail"), {
              to: c.email,
              message: {
                subject: personalize(subject, c.name),
                text: buildBroadcastText(body, c.name),
                html: buildBroadcastHtml(body, c.name),
              },
              type: "broadcast",
              batchId,
              createdAt: serverTimestamp(),
            })
          )
        );
        done += chunk.length;
        setProgress(done);
      }
      setSentCount(recipients.length);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while sending. Some emails may not have been queued.");
    } finally {
      setSending(false);
      setConfirm(false);
    }
  };

  const reset = () => {
    setSentCount(null);
    setSubject("");
    setBody(DEFAULT_BODY);
    setProgress(0);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 md:py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827]">Broadcast</h1>
          <p className="text-sm text-gray-500 font-medium">
            Send one personalised email to all your contacts. Each person gets their own name.
          </p>
        </div>

        {sentCount !== null ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 mb-5">
              <CheckCircle2 className="w-8 h-8 text-[#16a34a]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#111827] mb-2">Queued {sentCount} email{sentCount === 1 ? "" : "s"} 🎉</h2>
            <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
              They&apos;re sending from kirti@vetaas.in now. Large batches deliver over a few minutes.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Write another
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-[#7C3AED]" size={28} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Compose */}
            <div className="lg:col-span-3 space-y-5">
              {/* Audience */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Audience</p>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={useMembers} onChange={(e) => setUseMembers(e.target.checked)} className="w-4 h-4 accent-[#7C3AED]" />
                    <span className="text-sm font-semibold text-gray-700">Members</span>
                    <span className="text-xs text-gray-400">{members.length} contact{members.length === 1 ? "" : "s"}</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={useQuiz} onChange={(e) => setUseQuiz(e.target.checked)} className="w-4 h-4 accent-[#7C3AED]" />
                    <span className="text-sm font-semibold text-gray-700">Quiz takers</span>
                    <span className="text-xs text-gray-400">{quizContacts.length} contact{quizContacts.length === 1 ? "" : "s"}</span>
                  </label>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Add more (optional)</label>
                  <textarea
                    value={manual}
                    onChange={(e) => setManual(e.target.value)}
                    rows={2}
                    placeholder="Name <email@x.com>, another@x.com"
                    className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7C3AED] resize-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Subject</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="A little something from Vetaas 💛"
                    className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Message</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={9}
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7C3AED] resize-y font-[family-name:var(--font-poppins)]"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Tip: use <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[#7C3AED] font-bold">{"{{name}}"}</code> anywhere — it becomes each person&apos;s name (or &ldquo;there&rdquo; if unknown).
                  </p>
                </div>
              </div>
            </div>

            {/* Preview + send */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={15} className="text-[#7C3AED]" />
                  <span className="text-sm font-bold text-[#111827]">{recipients.length} recipient{recipients.length === 1 ? "" : "s"}</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {recipients.slice(0, 60).map((c) => (
                    <div key={c.email} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700 truncate">{c.name || "—"}</span>
                      <span className="text-gray-400 truncate ml-2">{c.email}</span>
                    </div>
                  ))}
                  {recipients.length > 60 && (
                    <p className="text-xs text-gray-400 pt-1">+ {recipients.length - 60} more…</p>
                  )}
                  {recipients.length === 0 && (
                    <p className="text-xs text-gray-400">Pick an audience to see recipients.</p>
                  )}
                </div>
              </div>

              {/* Live preview */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-500">Preview — as {preview.name || "there"}</span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-2">
                    <span className="font-bold text-gray-600">Subject:</span> {personalize(subject, preview.name) || "(no subject)"}
                  </p>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border-t border-gray-100 pt-3">
                    {personalize(body, preview.name)}
                  </div>
                </div>
              </div>

              {error && <p className="text-sm font-medium text-red-500">{error}</p>}

              {sending ? (
                <div className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-500 rounded-full text-sm font-bold">
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending {progress}/{recipients.length}…
                </div>
              ) : confirm ? (
                <div className="flex gap-2">
                  <button
                    onClick={send}
                    disabled={!canSend}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#16a34a] text-white rounded-full text-sm font-bold hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send size={15} /> Yes, send to {recipients.length}
                  </button>
                  <button
                    onClick={() => setConfirm(false)}
                    className="px-5 py-3.5 bg-white border border-gray-200 text-gray-500 rounded-full text-sm font-bold hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirm(true)}
                  disabled={!canSend}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold transition-all ${
                    canSend ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={15} /> Send broadcast
                </button>
              )}
              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                Sends from kirti@vetaas.in. Keep large sends reasonable to stay within your mailbox&apos;s daily limit.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
