"use client";

import { useState } from "react";
import Link from "next/link";
import { httpsCallable } from "firebase/functions";
import { signInAnonymously } from "firebase/auth";
import { auth, functions } from "@/lib/firebase";
import { loadRazorpayScript, openRazorpay } from "@/lib/razorpay";
import { fmtINR, lineTotal, useCart } from "@/lib/cart";
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

interface CartLine {
  id: string;
  kind: "membership" | "product";
  qty: number;
}

const createCartOrder = httpsCallable<
  {
    items: CartLine[];
    name: string;
    email: string;
    phone: string;
    childName: string;
    childAge: string;
    attendees: string;
  },
  {
    orderId: string;
    free: boolean;
    razorpayOrderId?: string;
    amount?: number;
    currency?: string;
    keyId?: string;
  }
>(functions, "createCartOrder");

const inputBase =
  "px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#7C3AED]";
const inputClass = `w-full ${inputBase}`;

const verifyCartPayment = httpsCallable<
  {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
  { ok: boolean }
>(functions, "verifyCartPayment");

export default function CartClient() {
  const { items, total, hasMembership, setQty, remove, clear, ready } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    childName: "",
    childAge: "",
    attendees: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const checkout = async () => {
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError("Please add your name and email.");
      return;
    }
    if (
      hasMembership &&
      (!form.childName.trim() || !form.childAge.trim() || !form.attendees || !form.phone.trim())
    ) {
      setError("Please complete your child's details, who's attending, and a phone number.");
      return;
    }

    setBusy(true);
    try {
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch {}
      }

      const payload = {
        items: items.map(({ id, kind, qty }) => ({ id, kind, qty })),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        childName: form.childName.trim(),
        childAge: form.childAge.trim(),
        attendees: form.attendees,
      };

      // A cart of only free worksheets never touches Razorpay.
      if (total <= 0) {
        await createCartOrder(payload);
        clear();
        setDone(true);
        return;
      }

      await loadRazorpayScript();
      const { data: order } = await createCartOrder(payload);

      const rzp = openRazorpay({
        key: order.keyId!,
        amount: order.amount!,
        currency: order.currency!,
        name: "Vetaas Education Foundation",
        description: hasMembership ? "Membership & downloads" : "Vetaas downloads",
        order_id: order.razorpayOrderId!,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#7C3AED" },
        handler: async (response) => {
          try {
            await verifyCartPayment({
              orderId: order.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clear();
            setDone(true);
          } catch {
            // The webhook confirms it independently, so don't call it a failure.
            setError(
              "Payment received, but confirming it took longer than expected. Your email is on its way — no need to pay again."
            );
          } finally {
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });

      rzp.on("payment.failed", (event) => {
        const reason = event?.error?.description;
        setError(
          `Payment didn't go through${reason ? ` — ${reason}` : ""}. If money was debited it will be refunded automatically within 5–7 days.`
        );
        setBusy(false);
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  const monthly = items
    .filter((i) => i.kind === "membership")
    .reduce((sum, i) => sum + lineTotal(i), 0);

  const shell = (content: React.ReactNode) => (
    <main className="min-h-screen bg-[#faf9f6] pt-[calc(var(--header-height)+3rem)] pb-24 px-6">
      <div className="max-w-4xl mx-auto">{content}</div>
    </main>
  );

  if (done) {
    return shell(
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 text-[#00CDBA]" size={40} />
        <h1 className="text-2xl font-headline font-bold text-[#111827] mb-2">Thank you!</h1>
        <p className="text-gray-500 font-medium leading-relaxed max-w-md mx-auto">
          Check your email — your downloads and membership details are on their way. Paid
          download links stay valid for 72 hours, so save the files to your device.
        </p>
        <Link
          href="/products"
          className="inline-block mt-6 px-6 py-3 bg-[#7C3AED] text-white font-bold text-sm rounded-full hover:bg-[#6D28D9] transition-colors"
        >
          Back to products
        </Link>
      </div>
    );
  }

  if (!ready) {
    return shell(
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#7C3AED]" size={28} />
      </div>
    );
  }

  if (items.length === 0) {
    return shell(
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
        <ShoppingBag className="mx-auto mb-4 text-gray-300" size={36} />
        <h1 className="text-xl font-headline font-bold text-[#111827] mb-2">Your cart is empty</h1>
        <p className="text-gray-500 font-medium mb-6">
          Add a membership plan or a worksheet to get started.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/services#membership"
            className="px-6 py-3 bg-[#7C3AED] text-white font-bold text-sm rounded-full hover:bg-[#6D28D9] transition-colors"
          >
            See membership plans
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 bg-white border border-gray-200 text-[#111827] font-bold text-sm rounded-full hover:bg-gray-50 transition-colors"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return shell(
    <>
      <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#111827] tracking-tight mb-8">
        Your cart
      </h1>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#111827] truncate">{item.name}</p>
                <p className="text-[13px] text-gray-400 font-medium">
                  {item.kind === "membership"
                    ? `${fmtINR(item.price)} / month`
                    : item.price === 0
                      ? "Free download"
                      : fmtINR(item.price)}
                </p>
              </div>

              {item.kind === "membership" && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setQty(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                    aria-label="Fewer"
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-7 text-center text-sm font-bold tabular-nums">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.id, item.qty + 1)}
                    aria-label="More"
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}

              <p className="w-20 text-right font-bold text-[#111827] tabular-nums shrink-0">
                {lineTotal(item) === 0 ? "Free" : fmtINR(lineTotal(item))}
              </p>

              <button
                onClick={() => remove(item.id)}
                aria-label={`Remove ${item.name}`}
                className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          {items.some((i) => i.kind === "membership" && i.qty > 1) && (
            <p className="text-[13px] text-gray-400 font-medium px-1">
              Sibling discount applied to additional memberships.
            </p>
          )}
        </div>

        {/* Checkout */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-28">
          {/* Named line per item: "Downloads" told people when they'd pay but
              not what for. Membership recurs, downloads don't, so each row
              carries its own suffix. */}
          <div className="pb-4 mb-4 border-b border-gray-100 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-gray-500 font-medium truncate">
                  {item.name}
                  {item.kind === "membership" && item.qty > 1 && (
                    <span className="text-gray-400"> &times;{item.qty}</span>
                  )}
                </span>
                <span className="font-bold text-[#111827] tabular-nums shrink-0">
                  {lineTotal(item) === 0 ? "Free" : fmtINR(lineTotal(item))}
                  {item.kind === "membership" ? (
                    <span className="text-xs text-gray-400 font-semibold">/month</span>
                  ) : (
                    lineTotal(item) > 0 && (
                      <span className="text-xs text-gray-400 font-semibold"> one-time</span>
                    )
                  )}
                </span>
              </div>
            ))}

            <div className="flex items-baseline justify-between pt-2.5 mt-1 border-t border-gray-100">
              <span className="font-bold text-[#111827]">
                {monthly > 0 ? "Total today" : "Total"}
              </span>
              <span className="text-2xl font-bold text-[#111827] tabular-nums">
                {total === 0 ? "Free" : fmtINR(total)}
              </span>
            </div>
            {monthly > 0 && (
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Membership renews at {fmtINR(monthly)}/month.
              </p>
            )}
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 text-center mb-3">
            Your details
          </p>

          <div className="space-y-3">
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder={hasMembership ? "Parent's full name" : "Your full name"}
              className={inputClass}
            />

            {hasMembership && (
              <>
                <div className="flex gap-3">
                  <input
                    value={form.childName}
                    onChange={(e) => set("childName", e.target.value)}
                    placeholder="Child's name"
                    className={`flex-1 min-w-0 ${inputBase}`}
                  />
                  <input
                    type="number"
                    min={1}
                    max={18}
                    value={form.childAge}
                    onChange={(e) => set("childAge", e.target.value)}
                    placeholder="Age"
                    className={`w-20 shrink-0 ${inputBase}`}
                  />
                </div>

                <select
                  value={form.attendees}
                  onChange={(e) => set("attendees", e.target.value)}
                  className={`${inputClass} cursor-pointer ${
                    form.attendees ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  <option value="" disabled>
                    Who will attend the sessions?
                  </option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Child and Parent">Child and Parent</option>
                </select>
              </>
            )}

            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder={
                hasMembership
                  ? "Email (confirmation goes here)"
                  : "Email (downloads are sent here)"
              }
              className={inputClass}
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder={hasMembership ? "Phone number" : "Phone number (optional)"}
              className={inputClass}
            />
          </div>

          <button
            onClick={checkout}
            disabled={busy}
            className="w-full mt-5 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7C3AED] text-white font-bold text-sm rounded-full hover:bg-[#6D28D9] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {total === 0 ? "Get my downloads" : `Pay ${fmtINR(total)}`}
          </button>

          {error && (
            <p className="mt-3 text-[13px] font-semibold text-red-500 leading-relaxed">{error}</p>
          )}

          <p className="mt-3 text-[11px] text-gray-400 text-center leading-relaxed">
            {total === 0
              ? "No payment needed — we'll email your files."
              : "Secure checkout via Razorpay — card, UPI, netbanking & more."}
          </p>
        </div>
      </div>
    </>
  );
}
