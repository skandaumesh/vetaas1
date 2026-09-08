"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
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
  // Plans feed the site-wide cart; checkout happens on /cart alongside any
  // worksheets or card decks in the same order.
  const { add: addToSharedCart } = useCart();
  const [added, setAdded] = useState<string | null>(null);
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
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;
    addToSharedCart({
      id: plan.id,
      kind: "membership",
      name: `${plan.name} membership`,
      price: plan.price,
      siblingDiscount: plan.siblingDiscount,
    });
    setAdded(plan.id);
    window.setTimeout(() => setAdded((cur) => (cur === plan.id ? null : cur)), 2200);
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
              {added === plan.id ? "Added to cart" : `Choose ${plan.name}`}
            </button>
            {added === plan.id && (
              <Link
                href="/cart"
                className="mt-2 block text-center text-[13px] font-bold text-[#7C3AED] hover:underline"
              >
                View cart &rarr;
              </Link>
            )}
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

    </section>
  );
}
