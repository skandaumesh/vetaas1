"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import {
  Check,
  CheckCircle2,
  CreditCard,
  Loader2,
  Mail,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = "918951004160";
const CONTACT_EMAIL = "kirti@vetaas.in";
const CART_STORAGE_KEY = "vetaas-membership-cart";

// ⚠️⚠️ TEST PRICING — shows ₹1/₹2/₹3 instead of the real prices so live-mode
// payments can be verified cheaply. MUST be set back to false before this page
// is exposed to real customers. The server has its own copy of this flag in
// functions/index.js — BOTH must be flipped, or checkout will fail with a
// price mismatch between what's shown and what's charged.
const TEST_PRICING = false;

type Plan = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  siblingDiscount: number; // fraction off each additional membership
  accent: string; // soft card background
  headerText: string; // label + price colour
  buttonBg: string; // button background (palette colour)
  buttonText: string; // readable text on the button
  features: { label: string; included: boolean }[];
};

const PLANS: Plan[] = [
  {
    id: "curious",
    name: "Curious",
    tagline: "Discover and explore the Vetaas experience.",
    price: TEST_PRICING ? 1 : 2999,

    siblingDiscount: 0.05,
    accent: "#e7faf6",
    headerText: "#00cdba",
    buttonBg: "#00cdba",
    buttonText: "#ffffff",
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
    price: TEST_PRICING ? 2 : 5999,

    siblingDiscount: 0.1,
    accent: "#fff0f2",
    headerText: "#ff5c7a",
    buttonBg: "#ff5c7a",
    buttonText: "#ffffff",
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
    price: TEST_PRICING ? 3 : 9999,

    siblingDiscount: 0.2,
    accent: "#eaf3ff",
    headerText: "#268bff",
    buttonBg: "#268bff",
    buttonText: "#ffffff",
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

// Loads the Razorpay Checkout script once and reuses it across opens.
let razorpayScriptPromise: Promise<void> | null = null;
function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if ((window as unknown as { Razorpay?: unknown }).Razorpay) return Promise.resolve();
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal: { ondismiss: () => void };
}
interface RazorpayFailedEvent {
  error?: { description?: string; reason?: string };
}
interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (e: RazorpayFailedEvent) => void) => void;
}

const createMembershipOrder = httpsCallable<
  {
    items: CartItem[];
    parentName: string;
    childName: string;
    childAge: string;
    attendees: string;
    email: string;
    phone: string;
  },
  { firestoreOrderId: string; razorpayOrderId: string; amount: number; currency: string; keyId: string }
>(functions, "createMembershipOrder");

const verifyMembershipPayment = httpsCallable<
  RazorpaySuccessResponse & { firestoreOrderId: string },
  { ok: boolean }
>(functions, "verifyMembershipPayment");

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

  // Contact form
  const [form, setForm] = useState({
    parentName: "",
    childName: "",
    childAge: "",
    attendees: "",
    email: "",
    phone: "",
  });
  const [paying, setPaying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const setField =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const orderMessage = useMemo(() => {
    const lines = cart
      .map((i) => {
        const plan = PLANS.find((p) => p.id === i.planId);
        if (!plan) return "";
        return `• ${plan.name} membership — ${formatINR(plan.price)}/month × ${i.qty} = ${formatINR(planTotal(plan, i.qty))}/month`;
      })
      .filter(Boolean);
    return [
      "Hi Vetaas! I'd like to purchase a membership:",
      ...lines,
      `Total: ${formatINR(total)}/month`,
      "Having trouble checking out online — can you help?",
    ].join("\n");
  }, [cart, total]);

  const payNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setPayError(null);
    try {
      await loadRazorpayScript();
      const { data: order } = await createMembershipOrder({
        items: cart,
        parentName: form.parentName.trim(),
        childName: form.childName.trim(),
        childAge: form.childAge.trim(),
        attendees: form.attendees,
        email: form.email.trim(),
        phone: form.phone.trim(),
      });

      const Razorpay = (window as unknown as { Razorpay: new (options: RazorpayOptions) => RazorpayInstance })
        .Razorpay;
      const rzp = new Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "Vetaas Education Foundation",
        description: "The Nest — Membership",
        prefill: { name: form.parentName.trim(), email: form.email.trim(), contact: form.phone.trim() },
        theme: { color: "#7C3AED" },
        handler: (response) => {
          (async () => {
            try {
              await verifyMembershipPayment({ firestoreOrderId: order.firestoreOrderId, ...response });
              setSubmitted(true);
              setCart([]);
            } catch {
              setPayError(
                "Payment succeeded but we couldn't confirm it automatically. WhatsApp us the payment ID and we'll sort it out right away."
              );
            } finally {
              setPaying(false);
            }
          })();
        },
        modal: { ondismiss: () => setPaying(false) },
      });

      // Razorpay closes its modal on a failed payment without calling `handler`,
      // so without this the visitor is left staring at the form with no
      // explanation — even though their bank may have debited them.
      rzp.on("payment.failed", (event) => {
        const reason = event?.error?.description;
        setPayError(
          `Payment didn't go through${reason ? ` — ${reason}` : ""}. If money was debited it will be refunded automatically within 5–7 days. You can try again, or reach us on WhatsApp.`
        );
        setPaying(false);
      });

      rzp.open();
    } catch {
      setPayError("Something went wrong starting checkout. Please try again, or reach us on WhatsApp.");
      setPaying(false);
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
          Membership <span className="inline-block bg-[#00cdba] text-white px-5 py-1 rounded-2xl -rotate-1 shadow-sm font-semibold">Plans.</span>
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
              style={{ backgroundColor: plan.buttonBg, color: plan.buttonText }}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-sm rounded-full hover:brightness-105 hover:scale-[1.02] transition-all shadow-md cursor-pointer"
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
                    <CheckCircle2 size={48} className="text-[#00cdba] mx-auto mb-4" />
                    <p className="font-extrabold text-[#111827] text-lg mb-2">Payment successful!</p>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                      Your membership is confirmed. We&apos;ve emailed your membership ID and details —
                      check your inbox.
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

              {cart.length > 0 && !submitted && (
                <div className="p-6 border-t border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-600">Total</span>
                    <span className="text-2xl font-extrabold text-[#111827]">
                      {formatINR(total)}<span className="text-sm text-gray-500 font-semibold">/month</span>
                    </span>
                  </div>

                  <form onSubmit={payNow} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 text-center">
                      Your details
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
                    {payError && (
                      <p className="text-xs text-red-500 font-semibold text-center">{payError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={paying}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7C3AED] text-white font-bold text-sm rounded-full hover:bg-[#6D28D9] hover:scale-[1.02] transition-all shadow-md disabled:opacity-60 disabled:hover:scale-100 cursor-pointer"
                    >
                      {paying ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                      {paying ? "Opening secure checkout…" : `Pay ${formatINR(total)} now`}
                    </button>
                    <p className="text-xs text-gray-400 font-medium text-center leading-relaxed">
                      Secure checkout via Razorpay — card, UPI, netbanking &amp; more. Your membership
                      is confirmed instantly.
                    </p>
                  </form>

                  <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-400">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
                    >
                      <MessageCircle size={13} />
                      Trouble paying? WhatsApp us
                    </a>
                    <span className="text-gray-200">|</span>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Vetaas Membership Purchase")}&body=${encodeURIComponent(orderMessage)}`}
                      className="inline-flex items-center gap-1.5 hover:text-[#7C3AED] transition-colors"
                    >
                      <Mail size={13} />
                      Email us
                    </a>
                  </div>
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
