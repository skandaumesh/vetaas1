"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { isAdminUser } from "@/lib/admin";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  buildEmailHtml,
  buildEmailText,
  buildRejectionHtml,
  buildRejectionText,
  buildReminderHtml,
  buildReminderText,
  EMAIL_SUBJECT,
  REJECTION_SUBJECT,
  reminderSubject,
} from "@/lib/membershipEmail";
import {
  BellRing,
  CheckCircle2,
  Clock,
  IndianRupee,
  Loader2,
  Lock,
  Mail,
  Maximize2,
  Phone,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";

type OrderStatus = "pending" | "approved" | "rejected";

interface OrderItem {
  plan: string;
  pricePerMonth: number;
  qty: number;
  monthly: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalMonthly: number;
  parentName: string;
  childName: string;
  childAge?: string;
  attendees?: string;
  email: string;
  phone: string;
  screenshotUrl: string;
  status: OrderStatus;
  membershipId?: string;
  validity?: string;
  createdAt?: { seconds: number };
  approvedAt?: { seconds: number };
  expiresAt?: { seconds: number };
  reminderSentAt?: { seconds: number };
}

const MEMBERSHIP_DAYS = 30;
const MEMBERSHIP_ID_PREFIX = "VET-";

// Next sequential ID from the ones already issued, e.g. VET-0007.
// Single-admin usage, so a Firestore counter/transaction isn't warranted.
function nextMembershipId(orders: Order[]): string {
  const highest = orders.reduce((max, o) => {
    const n = o.membershipId?.startsWith(MEMBERSHIP_ID_PREFIX)
      ? parseInt(o.membershipId.slice(MEMBERSHIP_ID_PREFIX.length), 10)
      : NaN;
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `${MEMBERSHIP_ID_PREFIX}${String(highest + 1).padStart(4, "0")}`;
}

const fmtDate = (t?: { seconds: number }) =>
  t
    ? new Date(t.seconds * 1000).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

// undefined = no expiry recorded; otherwise days remaining (negative = expired)
const daysLeft = (t?: { seconds: number }) =>
  t ? Math.ceil((t.seconds * 1000 - Date.now()) / 86400000) : undefined;

// "1 Aug – 31 Aug 2026" (year shown once when both dates share it)
function validityRange(startSec: number, endSec: number): string {
  const start = new Date(startSec * 1000);
  const end = new Date(endSec * 1000);
  const d = (x: Date) => x.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const sameYear = start.getFullYear() === end.getFullYear();
  return sameYear
    ? `${d(start)} – ${d(end)} ${end.getFullYear()}`
    : `${d(start)} ${start.getFullYear()} – ${d(end)} ${end.getFullYear()}`;
}

const formatINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// The sendMail Cloud Function (functions/index.js) watches the "mail"
// collection and delivers via kirti@vetaas.in. If it's ever torn down, set
// this back to false so Approve falls back to opening a pre-written email.
const AUTO_EMAIL_ENABLED = true;

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

function confirmationMailto(order: Order): string {
  return `mailto:${order.email}?subject=${encodeURIComponent(
    EMAIL_SUBJECT
  )}&body=${encodeURIComponent(buildEmailText(order))}`;
}

export default function AdminMembershipsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("pending");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  // Two-step confirmation before any email goes out: "approve:<id>" | "resend:<id>"
  const [confirmEmailKey, setConfirmEmailKey] = useState<string | null>(null);
  // Payment screenshot lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Only allowlisted admin emails get in — being logged in is not enough
      if (currentUser && !currentUser.isAnonymous && !isAdminUser(currentUser)) {
        setLoginError("This account is not authorized for admin access.");
        signOut(auth);
        setUser(null);
      } else {
        setUser(isAdminUser(currentUser) ? currentUser : null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(db, "membershipOrders"), orderBy("createdAt", "desc"))
        );
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
        // Backfill: orders approved before expiry/ID tracking existed are
        // missing those fields — fill them in so stats, badges, the reminder
        // scheduler, and membership IDs all work for historical orders too.
        // Sequential IDs are assigned oldest-first, hence the serial loop.
        const needsBackfill = list.filter(
          (o) => o.status === "approved" && (!o.expiresAt || !o.membershipId)
        );
        for (const o of needsBackfill.reverse()) {
          const patch: Record<string, unknown> = {};
          if (!o.expiresAt) {
            const baseSec =
              o.approvedAt?.seconds ??
              o.createdAt?.seconds ??
              Math.floor(Date.now() / 1000);
            const expiresAt = Timestamp.fromMillis(
              (baseSec + MEMBERSHIP_DAYS * 86400) * 1000
            );
            patch.expiresAt = expiresAt;
            o.expiresAt = { seconds: expiresAt.seconds };
          }
          if (!o.membershipId) {
            const id = nextMembershipId(list);
            patch.membershipId = id;
            o.membershipId = id;
          }
          await updateDoc(doc(db, "membershipOrders", o.id), patch);
        }
        setOrders(list);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setLoginError("Invalid email or password.");
    } finally {
      setLoggingIn(false);
    }
  };

  const setStatus = async (order: Order, status: OrderStatus) => {
    await updateDoc(doc(db, "membershipOrders", order.id), { status });
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
  };

  // Queue the email for the sendMail Cloud Function (watches the "mail" collection)
  const sendAutoEmail = async (order: Order) => {
    // Resends won't have validity passed in, so derive it from stored dates
    const withValidity: Order & { validity?: string } = {
      ...order,
      validity:
        order.validity ??
        (order.expiresAt
          ? validityRange(
              order.approvedAt?.seconds ??
                order.expiresAt.seconds - MEMBERSHIP_DAYS * 86400,
              order.expiresAt.seconds
            )
          : undefined),
    };
    await addDoc(collection(db, "mail"), {
      to: order.email,
      message: {
        subject: EMAIL_SUBJECT,
        text: buildEmailText(withValidity),
        html: buildEmailHtml(withValidity),
      },
      orderId: order.id,
      createdAt: serverTimestamp(),
    });
  };

  const approve = async (order: Order) => {
    const expiresAt = Timestamp.fromDate(
      new Date(Date.now() + MEMBERSHIP_DAYS * 86400000)
    );
    const membershipId = order.membershipId ?? nextMembershipId(orders);
    await updateDoc(doc(db, "membershipOrders", order.id), {
      status: "approved",
      approvedAt: serverTimestamp(),
      expiresAt,
      membershipId,
    });
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: "approved",
              membershipId,
              expiresAt: { seconds: expiresAt.seconds },
            }
          : o
      )
    );
    // Email must carry the ID and validity we just issued
    const approved = {
      ...order,
      membershipId,
      validity: validityRange(Math.floor(Date.now() / 1000), expiresAt.seconds),
    };
    if (AUTO_EMAIL_ENABLED) {
      await sendAutoEmail(approved);
    } else {
      // One-click confirmation email, fully pre-written
      window.open(confirmationMailto(approved), "_blank");
    }
  };

  const reject = async (order: Order) => {
    await setStatus(order, "rejected");
    if (AUTO_EMAIL_ENABLED) {
      await addDoc(collection(db, "mail"), {
        to: order.email,
        message: {
          subject: REJECTION_SUBJECT,
          text: buildRejectionText(order),
          html: buildRejectionHtml(order),
        },
        orderId: order.id,
        type: "rejection",
        createdAt: serverTimestamp(),
      });
    }
  };

  const sendReminder = async (order: Order) => {
    const dateStr = fmtDate(order.expiresAt);
    await addDoc(collection(db, "mail"), {
      to: order.email,
      message: {
        subject: reminderSubject(order.childName, dateStr),
        text: buildReminderText(order, dateStr),
        html: buildReminderHtml(order, dateStr),
      },
      orderId: order.id,
      type: "reminder",
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "membershipOrders", order.id), {
      reminderSentAt: serverTimestamp(),
    });
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? { ...o, reminderSentAt: { seconds: Math.floor(Date.now() / 1000) } }
          : o
      )
    );
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "membershipOrders", id));
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setDeleteConfirmId(null);
  };

  const visible = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (planFilter === "all" ||
        o.items?.some((i) => i.plan.toLowerCase() === planFilter))
  );

  // Dashboard stats
  const nowSec = Date.now() / 1000;
  const activeOrders = orders.filter(
    (o) => o.status === "approved" && o.expiresAt && o.expiresAt.seconds > nowSec
  );
  const activeMembers = activeOrders.reduce(
    (sum, o) => sum + (o.items?.reduce((s, i) => s + i.qty, 0) ?? 0),
    0
  );
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthStartSec = monthStart.getTime() / 1000;
  const earnedThisMonth = orders
    .filter((o) => {
      if (o.status !== "approved") return false;
      const t = o.approvedAt ?? o.createdAt;
      return t ? t.seconds >= monthStartSec : false;
    })
    .reduce((sum, o) => sum + (o.totalMonthly ?? 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const expiringSoon = activeOrders.filter((o) => daysLeft(o.expiresAt)! <= 5).length;

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#7C3AED]" size={32} />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 w-full max-w-sm space-y-4"
        >
          <div className="text-center mb-2">
            <div className="w-12 h-12 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mx-auto mb-3">
              <Lock className="text-[#7C3AED]" size={20} />
            </div>
            <h1 className="text-xl font-extrabold text-[#111827]">Membership Admin</h1>
            <p className="text-sm text-gray-500 font-medium">Sign in to manage orders</p>
          </div>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#7C3AED]"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#7C3AED]"
          />
          {loginError && (
            <p className="text-xs text-red-500 font-semibold text-center">{loginError}</p>
          )}
          <button
            type="submit"
            disabled={loggingIn}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7C3AED] text-white font-bold text-sm rounded-full hover:bg-[#6D28D9] transition-all disabled:opacity-60 cursor-pointer"
          >
            {loggingIn && <Loader2 size={16} className="animate-spin" />}
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 md:py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827]">
            Memberships Dashboard
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Verify the payment in your UPI app, then approve to send the confirmation email.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Active members",
              value: String(activeMembers),
              sub: `${activeOrders.length} active order${activeOrders.length === 1 ? "" : "s"}`,
              icon: <Users size={18} className="text-[#7C3AED]" />,
              iconBg: "bg-[#7C3AED]/10",
            },
            {
              label: "Earned this month",
              value: formatINR(earnedThisMonth),
              sub: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
              icon: <IndianRupee size={18} className="text-[#16a34a]" />,
              iconBg: "bg-green-100",
            },
            {
              label: "Pending verification",
              value: String(pendingCount),
              sub: pendingCount > 0 ? "needs your review" : "all caught up",
              icon: <Clock size={18} className="text-[#f59e0b]" />,
              iconBg: "bg-amber-100",
            },
            {
              label: "Expiring in 5 days",
              value: String(expiringSoon),
              sub: "auto-reminded 3 days before",
              icon: <BellRing size={18} className="text-[#ef4444]" />,
              iconBg: "bg-red-100",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-gray-200 p-5"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  {card.icon}
                </span>
                <span className="text-xs font-bold text-gray-500">{card.label}</span>
              </div>
              <p className="text-2xl font-extrabold text-[#111827] leading-none mb-1.5">
                {card.value}
              </p>
              <p className="text-[11px] text-gray-400 font-semibold">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
          <div className="flex gap-2">
            {(["pending", "approved", "rejected", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                  filter === f
                    ? "bg-[#111827] text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Plan</span>
            {["all", "curious", "grow", "flourish"].map((p) => (
              <button
                key={p}
                onClick={() => setPlanFilter(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-colors cursor-pointer ${
                  planFilter === p
                    ? "bg-[#7C3AED] text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-[#7C3AED]" size={28} />
          </div>
        ) : visible.length === 0 ? (
          <p className="text-center text-gray-400 font-medium py-24">
            No {filter === "all" ? "" : filter} orders.
          </p>
        ) : (
          <div className="space-y-4">
            {visible.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col md:flex-row gap-6"
              >
                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {order.membershipId && (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wider bg-[#111827] text-white font-mono">
                        {order.membershipId}
                      </span>
                    )}
                    <span className="font-extrabold text-[#111827]">{order.parentName}</span>
                    <span className="text-sm text-gray-500 font-medium">
                      for {order.childName}
                      {order.childAge ? ` (${order.childAge} yrs)` : ""}
                    </span>
                    {order.attendees && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#7C3AED]">
                        {order.attendees}
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                    {order.createdAt && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                        <Clock size={12} />
                        {new Date(order.createdAt.seconds * 1000).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    )}
                    {order.status === "approved" &&
                      order.expiresAt &&
                      (() => {
                        const d = daysLeft(order.expiresAt)!;
                        const style =
                          d < 0
                            ? "bg-red-100 text-red-600"
                            : d <= 5
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-600";
                        const label =
                          d < 0
                            ? `Expired ${fmtDate(order.expiresAt)}`
                            : `Expires ${fmtDate(order.expiresAt)} (${d}d left)`;
                        return (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${style}`}
                          >
                            {label}
                          </span>
                        );
                      })()}
                    {order.reminderSentAt && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                        <BellRing size={11} />
                        Reminder sent {fmtDate(order.reminderSentAt)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map((i) => (
                      <p key={i.plan} className="text-sm text-gray-600 font-medium">
                        {i.plan} × {i.qty} — {formatINR(i.monthly)}/month
                      </p>
                    ))}
                    <p className="text-sm font-extrabold text-[#111827]">
                      Total: {formatINR(order.totalMonthly)}/month
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                    <a
                      href={`mailto:${order.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-[#7C3AED]"
                    >
                      <Mail size={13} /> {order.email}
                    </a>
                    <a
                      href={`tel:${order.phone}`}
                      className="inline-flex items-center gap-1.5 hover:text-[#7C3AED]"
                    >
                      <Phone size={13} /> {order.phone}
                    </a>
                  </div>
                </div>

                <div className="flex md:flex-col items-center gap-3 shrink-0">
                  {order.screenshotUrl && (
                    <button
                      onClick={() => setLightboxUrl(order.screenshotUrl)}
                      className="block w-24 h-24 rounded-xl overflow-hidden border border-gray-200 relative group cursor-pointer"
                      title="View payment screenshot"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={order.screenshotUrl}
                        alt="Payment screenshot"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 size={16} className="text-white" />
                      </span>
                    </button>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 shrink-0 justify-center">
                  {order.status === "pending" && (
                    <>
                      {confirmEmailKey === `approve:${order.id}` ? (
                        <button
                          onClick={() => {
                            setConfirmEmailKey(null);
                            approve(order);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16a34a] text-white rounded-full text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
                        >
                          <CheckCircle2 size={14} />
                          Yes, send to {order.email.split("@")[0]}@…
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmEmailKey(`approve:${order.id}`)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#38d38b] text-white rounded-full text-xs font-bold hover:brightness-95 transition-all cursor-pointer"
                        >
                          <CheckCircle2 size={14} />
                          Approve &amp; Email
                        </button>
                      )}
                      {confirmEmailKey === `reject:${order.id}` ? (
                        <button
                          onClick={() => {
                            setConfirmEmailKey(null);
                            reject(order);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-all cursor-pointer"
                        >
                          <XCircle size={14} />
                          Yes, reject &amp; email
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmEmailKey(`reject:${order.id}`)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-full text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      )}
                    </>
                  )}
                  {order.status === "approved" &&
                    (AUTO_EMAIL_ENABLED ? (
                      confirmEmailKey === `resend:${order.id}` ? (
                        <button
                          onClick={() => {
                            setConfirmEmailKey(null);
                            sendAutoEmail(order);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16a34a] text-white rounded-full text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
                        >
                          <Mail size={14} />
                          Yes, resend now
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmEmailKey(`resend:${order.id}`)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          <Mail size={14} />
                          Resend email
                        </button>
                      )
                    ) : (
                      <a
                        href={confirmationMailto(order)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-100 transition-all"
                      >
                        <Mail size={14} />
                        Resend email
                      </a>
                    ))}
                  {order.status === "approved" &&
                    order.expiresAt &&
                    AUTO_EMAIL_ENABLED &&
                    (confirmEmailKey === `remind:${order.id}` ? (
                      <button
                        onClick={() => {
                          setConfirmEmailKey(null);
                          sendReminder(order);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f59e0b] text-white rounded-full text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
                      >
                        <BellRing size={14} />
                        Yes, send reminder
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmEmailKey(`remind:${order.id}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-bold hover:bg-amber-50 hover:text-amber-600 transition-all cursor-pointer"
                      >
                        <BellRing size={14} />
                        Send reminder
                      </button>
                    ))}
                  {deleteConfirmId === order.id ? (
                    <button
                      onClick={() => remove(order.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Confirm delete
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(order.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-400 rounded-full text-xs font-bold hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment screenshot lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close screenshot"
          >
            <X size={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Payment screenshot"
            className="max-w-[92vw] max-h-[88vh] rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </main>
  );
}
