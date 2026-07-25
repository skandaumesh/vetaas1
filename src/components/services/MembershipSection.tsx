"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Mail,
  MessageCircle,
  Minus,
  Paperclip,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = "918951004160";
const CONTACT_EMAIL = "kirti.vetaas@gmail.com";
const CART_STORAGE_KEY = "vetaas-membership-cart";

// Payment screenshots go to this WhatsApp number (not the general enquiry line).
const PAYMENT_WHATSAPP_NUMBER = "919108906009";

// Verified against the Google Pay QR shared by the owner — don't edit by hand.
const UPI: { id: string; payeeName: string } | null = { id: "ktkirti6@oksbi", payeeName: "Vetaas" };

type Plan = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  siblingDiscount: number; // fraction off each additional membership
  accent: string;
  headerText: string;
  features: { label: string; included: boolean }[];
};

const PLANS: Plan[] = [
  {
    id: "curious",
    name: "Curious",
    tagline: "Discover and explore the Vetaas experience.",
    price: 2999,

    siblingDiscount: 0.05,
    accent: "#fbf3e4",
    headerText: "#b45309",
    features: [
      { label: "7 flexible workshops / month", included: true },
      { label: "Recommended usage: 1–2 visits per week", included: true },
      { label: "Flexible access across all workshops", included: true },
      { label: "Studio access: Library", included: true },
      { label: "Co-working space access", included: false },
      { label: "5% discount on other Nest events", included: true },
      { label: "5% discount on sibling membership", included: true },
    ],
  },
  {
    id: "grow",
    name: "Grow",
    tagline: "Build consistent rhythm and deeper engagement.",
    price: 5999,

    siblingDiscount: 0.1,
    accent: "#fdecef",
    headerText: "#e23d6d",
    features: [
      { label: "14 flexible workshops / month", included: true },
      { label: "Recommended usage: 3 visits per week", included: true },
      { label: "Flexible access across all workshops", included: true },
      { label: "Studio access: Library + art supplies", included: true },
      { label: "Co-working space access", included: true },
      { label: "10% discount on other Nest events", included: true },
      { label: "10% discount on sibling membership", included: true },
    ],
  },
  {
    id: "flourish",
    name: "Flourish",
    tagline: "For families who want to be deeply immersed in the Vetaas community.",
    price: 9999,

    siblingDiscount: 0.2,
    accent: "#eaf2fb",
    headerText: "#2563eb",
    features: [
      { label: "All Children, Parent and/or Family workshops", included: true },
      { label: "Attend as often as your schedule allows", included: true },
      { label: "Unlimited access across all workshops", included: true },
      { label: "Studio access: Library + art supplies + borrow up to 4 books a month", included: true },
      { label: "Co-working space access", included: true },
      { label: "15% discount on other Nest events", included: true },
      { label: "20% discount on sibling membership", included: true },
    ],
  },
];

const TERMS = [
  "Membership sessions are valid only within the current month and cannot be carried forward.",
  "Membership is applicable only for the registered child.",
  "Please book your preferred sessions at least 2 days in advance.",
  "Sessions are subject to availability.",
  "Missed sessions cannot be carried forward or refunded.",
  "Cancellations must be made at least 24 hours in advance, otherwise the session is considered attended.",
];

type CartItem = { planId: string; qty: number };

const formatINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// Additional memberships of the same plan get the sibling discount
const planTotal = (plan: Plan, qty: number) =>
  plan.price + (qty - 1) * plan.price * (1 - plan.siblingDiscount);

export default function MembershipSection() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, hydrated]);

  const addToCart = (planId: string) => {
    setSubmitted(false);
    setCart((prev) => {
      const existing = prev.find((i) => i.planId === planId);
      if (existing) {
        return prev.map((i) => (i.planId === planId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { planId, qty: 1 }];
    });
    setDrawerOpen(true);
  };

  const changeQty = (planId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.planId === planId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (planId: string) => {
    setCart((prev) => prev.filter((i) => i.planId !== planId));
  };

  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const total = useMemo(
    () =>
      cart.reduce((sum, i) => {
        const plan = PLANS.find((p) => p.id === i.planId);
        return plan ? sum + planTotal(plan, i.qty) : sum;
      }, 0),
    [cart]
  );

  const orderMessage = useMemo(() => {
    const lines = cart
      .map((i) => {
        const plan = PLANS.find((p) => p.id === i.planId);
        if (!plan) return "";
        return `• ${plan.name} membership — ${formatINR(plan.price)}/month × ${i.qty} = ${formatINR(planTotal(plan, i.qty))}/month`;
      })
      .filter(Boolean);
    return [
      UPI
        ? "Hi Vetaas! I've purchased a membership and completed the UPI payment:"
        : "Hi Vetaas! I'd like to purchase a membership:",
      ...lines,
      `Total: ${formatINR(total)}/month`,
      UPI
        ? "I'm sharing the payment screenshot and details here."
        : "Please share the payment details.",
    ].join("\n");
  }, [cart, total]);

  const upiUri =
    UPI && total > 0
      ? `upi://pay?pa=${UPI.id}&pn=${encodeURIComponent(UPI.payeeName)}&am=${Math.round(total)}&cu=INR&tn=${encodeURIComponent("Vetaas Membership")}`
      : null;

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [upiCopied, setUpiCopied] = useState(false);
  useEffect(() => {
    if (!upiUri) {
      setQrDataUrl(null);
      return;
    }
    QRCode.toDataURL(upiUri, { width: 240, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [upiUri]);

  // Order submission form
  const [form, setForm] = useState({
    parentName: "",
    childName: "",
    childAge: "",
    attendees: "",
    email: "",
    phone: "",
  });
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotFile) {
      setSubmitError("Please attach your payment screenshot.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Ensure some auth exists for the rules check, without replacing an
      // existing session (e.g. the admin trying the flow while logged in)
      if (!auth.currentUser) {
        try { await signInAnonymously(auth); } catch {}
      }
      const path = `membership-screenshots/${Date.now()}-${screenshotFile.name.replace(/[^\w.-]/g, "_")}`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, screenshotFile);
      const screenshotUrl = await getDownloadURL(fileRef);
      await addDoc(collection(db, "membershipOrders"), {
        items: cart.map((i) => {
          const plan = PLANS.find((p) => p.id === i.planId)!;
          return { plan: plan.name, pricePerMonth: plan.price, qty: i.qty, monthly: Math.round(planTotal(plan, i.qty)) };
        }),
        totalMonthly: Math.round(total),
        parentName: form.parentName.trim(),
        childName: form.childName.trim(),
        childAge: form.childAge.trim(),
        attendees: form.attendees,
        email: form.email.trim(),
        phone: form.phone.trim(),
        screenshotUrl,
        upiId: UPI?.id ?? null,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setCart([]);
    } catch {
      setSubmitError(
        "Something went wrong while submitting. Please try again, or send the screenshot on WhatsApp instead."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="membership" className="mb-32 scroll-mt-32">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1.5 px-6 rounded-full bg-white border border-gray-200 text-gray-800 font-bold text-xs tracking-widest uppercase mb-4 shadow-sm">
NEST MEMBERSHIP GUIDE
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-headline text-[#111827] tracking-tight mb-6"
        >
          Membership <span className="inline-block bg-[#38d38b] text-white px-5 py-1 rounded-2xl -rotate-1 shadow-sm font-semibold">Plans.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-500 font-medium text-base md:text-lg leading-relaxed"
        >
          Choose the plan that fits your journey with The Nest.
        </motion.p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {PLANS.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-[2.5rem] p-8 flex flex-col shadow-sm border border-black/5"
            style={{ backgroundColor: plan.accent }}
          >
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: plan.headerText }}
            >
              {plan.name}
            </span>
            <p className="text-gray-700 font-medium text-sm leading-snug mb-6 min-h-[2.5rem]">
              {plan.tagline}
            </p>
            <div className="mb-8">
              <span
                style={{ color: plan.headerText }}
                className="text-4xl font-extrabold tracking-tight"
              >
                {formatINR(plan.price)}
              </span>
              <span className="text-gray-600 font-semibold text-sm"> / month</span>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {plan.features.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      f.included ? "bg-white/70 text-black" : "bg-black/5 text-gray-400"
                    }`}
                  >
                    {f.included ? <Check size={12} strokeWidth={3} /> : <Minus size={12} strokeWidth={3} />}
                  </div>
                  <span
                    className={`text-sm leading-snug ${
                      f.included ? "font-semibold text-gray-800" : "font-medium text-gray-400 line-through decoration-transparent"
                    }`}
                  >
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => addToCart(plan.id)}
              style={{ backgroundColor: plan.headerText }}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold text-sm rounded-full hover:brightness-110 hover:scale-[1.02] transition-all shadow-md cursor-pointer"
            >
              <ShoppingCart size={16} />
              Choose {plan.name}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Terms & Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-gray-50 border border-gray-200 rounded-[2rem] p-8"
      >
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-4">
          Terms &amp; Conditions
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
          {TERMS.map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm text-gray-500 font-medium leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-1.5" />
              {t}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Cart UI is portaled to <body>: the page wraps this section in a
          stacking context (relative z-10) that would trap fixed elements
          below the navbar (z-50) and event banner (z-[60]) */}
      {hydrated &&
        createPortal(
          <>
      {/* Floating cart button */}
      <AnimatePresence>
        {itemCount > 0 && !drawerOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setDrawerOpen(true)}
            className="fixed bottom-24 right-8 z-40 inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#7C3AED] text-white font-bold text-sm rounded-full shadow-xl hover:bg-[#6D28D9] hover:scale-105 transition-all cursor-pointer"
          >
            <ShoppingCart size={18} />
            Cart
            <span className="bg-white text-[#7C3AED] rounded-full w-6 h-6 flex items-center justify-center text-xs font-extrabold">
              {itemCount}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-[70]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-extrabold text-[#111827] flex items-center gap-2">
                  <ShoppingCart size={20} className="text-[#7C3AED]" />
                  Your Cart
                </h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto">
              <div className="p-6 space-y-4">
                {submitted && (
                  <div className="text-center mt-12 px-4">
                    <CheckCircle2 size={48} className="text-[#38d38b] mx-auto mb-4" />
                    <p className="font-extrabold text-[#111827] text-lg mb-2">Order received!</p>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                      We&apos;ve got your payment details. We&apos;ll verify the payment and email
                      your membership confirmation within 24 hours.
                    </p>
                  </div>
                )}
                {cart.length === 0 && !submitted && (
                  <p className="text-gray-500 font-medium text-sm text-center mt-12">
                    Your cart is empty. Choose a membership plan to get started.
                  </p>
                )}
                {cart.map((item) => {
                  const plan = PLANS.find((p) => p.id === item.planId);
                  if (!plan) return null;
                  return (
                    <div
                      key={item.planId}
                      className="rounded-2xl border border-gray-200 p-4"
                      style={{ backgroundColor: plan.accent }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-extrabold text-[#111827]">{plan.name} Membership</p>
                          <p className="text-sm text-gray-600 font-medium">
                            {formatINR(plan.price)}/month
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.planId)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          aria-label={`Remove ${plan.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white rounded-full px-2 py-1">
                          <button
                            onClick={() => changeQty(item.planId, -1)}
                            className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => changeQty(item.planId, 1)}
                            className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-extrabold text-[#111827] text-sm">
                          {formatINR(planTotal(plan, item.qty))}/mo
                        </p>
                      </div>
                      {item.qty > 1 && plan.siblingDiscount > 0 && (
                        <p className="text-xs text-gray-600 font-semibold mt-2">
                          Includes {plan.siblingDiscount * 100}% sibling discount on additional memberships.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-600">Total</span>
                    <span className="text-2xl font-extrabold text-[#111827]">
                      {formatINR(total)}<span className="text-sm text-gray-500 font-semibold">/month</span>
                    </span>
                  </div>

                  {upiUri ? (
                    <>
                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                          Step 1 · Pay {formatINR(total)} via UPI
                        </p>
                        {/* Desktop: scan the QR with a phone */}
                        <div className="hidden md:block">
                          {qrDataUrl && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={qrDataUrl}
                              alt={`UPI payment QR code for ${formatINR(total)}`}
                              className="mx-auto w-44 h-44 rounded-lg bg-white p-2 border border-gray-200"
                            />
                          )}
                          <p className="text-xs text-gray-500 font-medium mt-2">
                            Scan with PhonePe, Google Pay, or any UPI app
                          </p>
                        </div>
                        {/* Mobile: open the UPI app directly — you can't scan your own screen */}
                        <a
                          href={upiUri}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#5f259f] text-white font-bold text-sm rounded-full hover:brightness-110 transition-all md:hidden"
                        >
                          Open UPI app to pay
                          <ArrowRight size={16} />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(UPI!.id);
                            setUpiCopied(true);
                            setTimeout(() => setUpiCopied(false), 2000);
                          }}
                          className="mt-3 mx-auto flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#7C3AED] transition-colors cursor-pointer"
                        >
                          {upiCopied ? (
                            <>
                              <Check size={13} className="text-[#38d38b]" /> UPI ID copied!
                            </>
                          ) : (
                            <>or pay to UPI ID: <span className="font-extrabold text-gray-700">{UPI!.id}</span> (tap to copy)</>
                          )}
                        </button>
                      </div>
                      <form onSubmit={submitOrder} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 text-center">
                          Step 2 · Submit your payment details
                        </p>
                        <input
                          required
                          value={form.parentName}
                          onChange={setField("parentName")}
                          placeholder="Parent's full name"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#7C3AED]"
                        />
                        <div className="flex gap-3">
                          <input
                            required
                            value={form.childName}
                            onChange={setField("childName")}
                            placeholder="Child's name"
                            className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#7C3AED]"
                          />
                          <input
                            required
                            type="number"
                            min={1}
                            max={18}
                            value={form.childAge}
                            onChange={setField("childAge")}
                            placeholder="Age"
                            className="w-24 shrink-0 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#7C3AED]"
                          />
                        </div>
                        <select
                          required
                          value={form.attendees}
                          onChange={setField("attendees")}
                          className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#7C3AED] cursor-pointer ${
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
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={setField("email")}
                          placeholder="Email (membership confirmation goes here)"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#7C3AED]"
                        />
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={setField("phone")}
                          placeholder="Phone number"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#7C3AED]"
                        />
                        <label className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 bg-white text-sm font-medium text-gray-600 cursor-pointer hover:border-[#7C3AED] transition-colors">
                          <Paperclip size={15} className="shrink-0" />
                          <span className="truncate">
                            {screenshotFile ? screenshotFile.name : "Attach payment screenshot"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setScreenshotFile(e.target.files?.[0] ?? null)}
                          />
                        </label>
                        {submitError && (
                          <p className="text-xs text-red-500 font-semibold text-center">{submitError}</p>
                        )}
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7C3AED] text-white font-bold text-sm rounded-full hover:bg-[#6D28D9] hover:scale-[1.02] transition-all shadow-md disabled:opacity-60 disabled:hover:scale-100 cursor-pointer"
                        >
                          {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                          {submitting ? "Submitting…" : "Submit for verification"}
                        </button>
                        <a
                          href={`https://wa.me/${PAYMENT_WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center text-xs font-bold text-gray-500 hover:text-[#25D366] transition-colors"
                        >
                          <MessageCircle size={13} className="inline mr-1 -mt-0.5" />
                          Prefer WhatsApp? Send the screenshot to us there instead
                        </a>
                      </form>
                      <p className="text-xs text-gray-400 font-medium text-center leading-relaxed">
                        We&apos;ll verify your payment and email your membership confirmation within 24 hours.
                      </p>
                    </>
                  ) : (
                    <>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white font-bold text-sm rounded-full hover:brightness-95 hover:scale-[1.02] transition-all shadow-md"
                      >
                        <MessageCircle size={18} />
                        Checkout on WhatsApp
                        <ArrowRight size={16} />
                      </a>
                      <a
                        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Vetaas Membership Purchase")}&body=${encodeURIComponent(orderMessage)}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-300 text-gray-800 font-bold text-sm rounded-full hover:bg-gray-50 transition-all"
                      >
                        <Mail size={18} />
                        Checkout via Email
                      </a>
                      <p className="text-xs text-gray-400 font-medium text-center leading-relaxed">
                        We&apos;ll confirm availability and share payment details to complete your membership.
                      </p>
                    </>
                  )}
                </div>
              )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
          </>,
          document.body
        )}
    </section>
  );
}
