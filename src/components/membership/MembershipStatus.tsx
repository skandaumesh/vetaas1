"use client";

import { useState } from "react";
import Link from "next/link";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, Loader2, Search } from "lucide-react";

interface StatusResult {
  found: boolean;
  membershipId?: string;
  childName?: string;
  plan?: string;
  expiresAt?: number | null;
  daysLeft?: number | null;
  active?: boolean;
}

const checkMembership = httpsCallable<
  { membershipId: string; email: string },
  StatusResult
>(functions, "checkMembership");

const fmtDate = (ms: number) =>
  new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function MembershipStatus() {
  const [membershipId, setMembershipId] = useState("");
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(null);
    setResult(null);
    try {
      const res = await checkMembership({
        membershipId: membershipId.trim(),
        email: email.trim(),
      });
      setResult(res.data);
    } catch {
      setError("Something went wrong. Please try again, or WhatsApp us.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] pt-[calc(var(--header-height)+3rem)] pb-24 px-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#111827] tracking-tight mb-3">
            Check your membership
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Enter the membership ID from your confirmation email along with the email address you
            signed up with.
          </p>
        </div>

        <form
          onSubmit={check}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Membership ID
            </label>
            <input
              required
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
              placeholder="VET-0001"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium uppercase tracking-wide focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <button
            type="submit"
            disabled={checking}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7C3AED] text-white font-bold text-sm rounded-full hover:bg-[#6D28D9] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {checking ? <Loader2 size={17} className="animate-spin" /> : <Search size={16} />}
            {checking ? "Checking…" : "Check status"}
          </button>

          {error && (
            <p className="text-xs text-red-500 font-semibold text-center">{error}</p>
          )}
        </form>

        {/* Active membership */}
        {result?.found && (
          <div className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
            <div className="flex items-center gap-2.5 mb-5">
              {result.active ? (
                <>
                  <CheckCircle2 size={20} className="text-[#00CDBA]" />
                  <span className="font-bold text-[#111827]">Membership active</span>
                </>
              ) : (
                <>
                  <AlertCircle size={20} className="text-[#FF5C7A]" />
                  <span className="font-bold text-[#111827]">Membership expired</span>
                </>
              )}
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Membership ID</dt>
                <dd className="font-mono font-bold text-[#111827]">{result.membershipId}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">For</dt>
                <dd className="font-semibold text-[#111827]">{result.childName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Plan</dt>
                <dd className="font-semibold text-[#111827]">{result.plan}</dd>
              </div>
              {result.expiresAt && (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">
                    {result.active ? "Valid until" : "Expired on"}
                  </dt>
                  <dd className="font-semibold text-[#111827]">{fmtDate(result.expiresAt)}</dd>
                </div>
              )}
            </dl>

            {result.active && typeof result.daysLeft === "number" && (
              <div
                className={`mt-5 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${
                  result.daysLeft <= 5
                    ? "bg-amber-50 text-amber-700"
                    : "bg-[#00CDBA]/10 text-[#00998c]"
                }`}
              >
                <CalendarDays size={15} />
                {result.daysLeft === 0
                  ? "Expires today"
                  : `${result.daysLeft} day${result.daysLeft === 1 ? "" : "s"} remaining`}
              </div>
            )}

            <Link
              href="/services#membership"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7C3AED] text-white font-bold text-sm rounded-full hover:bg-[#6D28D9] transition-colors"
            >
              {result.active ? "Renew early" : "Renew membership"}
              <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* Deliberately vague: the same message whether the ID doesn't exist or
            the email doesn't match, so this can't be used to probe for members. */}
        {result && !result.found && (
          <div className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-7 text-center">
            <AlertCircle size={22} className="text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-[#111827] mb-1.5">No active membership found</p>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Check that the membership ID and email match your confirmation email. If you still
              can&apos;t find it, WhatsApp us on{" "}
              <a
                href="https://wa.me/918951004160"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C3AED] font-bold hover:underline"
              >
                +91 89510 04160
              </a>{" "}
              and we&apos;ll sort it out.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
