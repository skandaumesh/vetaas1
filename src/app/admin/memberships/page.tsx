"use client";

import { Fragment, useEffect, useState } from "react";
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
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/AdminGate";
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
  AlertTriangle,
  BellRing,
  ChevronRight,
  Loader2,
  Mail,
  Maximize2,
  Phone,
  Search,
  X,
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
  /** Legacy manual-UPI orders only; Razorpay orders have no screenshot */
  screenshotUrl?: string;
  razorpayOrderId?: string;
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

function confirmationMailto(order: Order): string {
  return `mailto:${order.email}?subject=${encodeURIComponent(
    EMAIL_SUBJECT
  )}&body=${encodeURIComponent(buildEmailText(order))}`;
}

export default function AdminMembershipsPage() {
  const { user } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  // Approved first — the actual member list is what's wanted on open;
  // anything needing action is surfaced by the badge on the Pending tab.
  const [filter, setFilter] = useState<OrderStatus | "all">("approved");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  // Two-step confirmation before any email goes out: "approve:<id>" | "resend:<id>"
  const [confirmEmailKey, setConfirmEmailKey] = useState<string | null>(null);
  // Payment screenshot lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const q = search.trim().toLowerCase();
  const visible = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (planFilter === "all" ||
        o.items?.some((i) => i.plan.toLowerCase() === planFilter)) &&
      (q === "" ||
        [o.parentName, o.childName, o.email, o.phone, o.membershipId]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q)))
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

  const statusDot: Record<OrderStatus, string> = {
    pending: "bg-amber-500",
    approved: "bg-emerald-500",
    rejected: "bg-rose-500",
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-[2.15rem] font-semibold tracking-[-0.02em] text-slate-900">
              Memberships <span className="text-slate-300">overview</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Online payments are verified and confirmed automatically. Manual approval is only
              needed for older UPI-screenshot orders.
            </p>
          </div>
          <div className="text-sm text-slate-500 tabular-nums">
            {orders.length} order{orders.length === 1 ? "" : "s"} total
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden mb-8">
          {[
            {
              label: "Active members",
              value: String(activeMembers),
              sub: `across ${activeOrders.length} order${activeOrders.length === 1 ? "" : "s"}`,
              alert: false,
            },
            {
              label: "Revenue this month",
              value: formatINR(earnedThisMonth),
              sub: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
              alert: false,
            },
            {
              label: "Awaiting review",
              value: String(pendingCount),
              sub: pendingCount > 0 ? "needs attention" : "all clear",
              alert: pendingCount > 0,
            },
            {
              label: "Expiring soon",
              value: String(expiringSoon),
              sub: "within 5 days",
              alert: expiringSoon > 0,
            },
          ].map((card) => (
            <div key={card.label} className="bg-white px-5 py-5">
              <p className="text-[13px] font-medium text-slate-400 mb-3">{card.label}</p>
              <p
                className={`text-[2.5rem] font-semibold tabular-nums tracking-[-0.03em] leading-none mb-2 ${
                  card.alert ? "text-amber-500" : "text-slate-900"
                }`}
              >
                {card.value}
              </p>
              <p className="text-xs text-slate-300">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-grow max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, ID…"
              className="w-full pl-9 pr-3 py-2 text-sm glass-input rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
            />
          </div>

          <div className="inline-flex bg-slate-100 rounded-lg p-0.5">
            {(["approved", "pending", "rejected", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium capitalize transition-colors cursor-pointer ${
                  filter === f
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f === "approved" ? "Members" : f}
                {f === "pending" && pendingCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold tabular-nums">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 text-[13px] glass-input rounded-lg text-slate-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="all">All plans</option>
            <option value="curious">Curious</option>
            <option value="grow">Grow</option>
            <option value="flourish">Flourish</option>
          </select>
        </div>

        {/* Table */}
        <div className="glass-solid rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-slate-300" size={24} />
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm text-slate-500">No matching orders.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-white/40">
                    {["Member", "Plan", "Amount", "Status", "Created", "Validity", ""].map((h, i) => (
                      <th
                        key={i}
                        className="text-left font-medium text-slate-500 text-xs uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((order) => {
                    const isOpen = expandedId === order.id;
                    const d = daysLeft(order.expiresAt);
                    const unpaid = order.status === "pending" && !!order.razorpayOrderId;
                    return (
                      <Fragment key={order.id}>
                        <tr
                          onClick={() => setExpandedId(isOpen ? null : order.id)}
                          className={`border-b border-slate-100 cursor-pointer transition-colors ${
                            isOpen ? "bg-slate-50" : "hover:bg-slate-50/60"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <ChevronRight
                                size={14}
                                className={`text-slate-300 shrink-0 transition-transform ${
                                  isOpen ? "rotate-90" : ""
                                }`}
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-900 truncate">
                                    {order.parentName}
                                  </span>
                                  {order.membershipId && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 shrink-0">
                                      {order.membershipId}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 truncate">
                                  for {order.childName}
                                  {order.childAge ? ` · ${order.childAge} yrs` : ""}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                            {order.items
                              ?.map((i) => `${i.plan}${i.qty > 1 ? ` ×${i.qty}` : ""}`)
                              .join(", ")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap tabular-nums text-slate-900 font-medium">
                            {formatINR(order.totalMonthly)}
                            <span className="text-slate-400 font-normal">/mo</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {unpaid ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600">
                                <AlertTriangle size={12} />
                                Payment not received
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 capitalize">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${statusDot[order.status]}`}
                                />
                                {order.status}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-xs">
                            {fmtDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs">
                            {order.status === "approved" && order.expiresAt ? (
                              <span
                                className={
                                  d! < 0
                                    ? "text-rose-600 font-medium"
                                    : d! <= 5
                                      ? "text-amber-600 font-medium"
                                      : "text-slate-500"
                                }
                              >
                                {d! < 0 ? `Expired ${fmtDate(order.expiresAt)}` : `${d}d left`}
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {order.reminderSentAt && (
                              <span title={`Reminder sent ${fmtDate(order.reminderSentAt)}`}>
                                <BellRing size={13} className="text-slate-300 inline" />
                              </span>
                            )}
                          </td>
                        </tr>

                        {isOpen && (
                          <tr className="border-b border-slate-100 bg-slate-50">
                            <td colSpan={7} className="px-4 pb-5 pt-1">
                              <div className="grid md:grid-cols-3 gap-6 pl-6">
                                <div className="space-y-3">
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    Contact
                                  </p>
                                  <a
                                    href={`mailto:${order.email}`}
                                    className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-violet-600"
                                  >
                                    <Mail size={13} className="text-slate-400" /> {order.email}
                                  </a>
                                  <a
                                    href={`tel:${order.phone}`}
                                    className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-violet-600"
                                  >
                                    <Phone size={13} className="text-slate-400" /> {order.phone}
                                  </a>
                                  {order.attendees && (
                                    <p className="text-[13px] text-slate-500">
                                      Attending: {order.attendees}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    Order
                                  </p>
                                  {order.items?.map((i) => (
                                    <p key={i.plan} className="text-[13px] text-slate-600">
                                      {i.plan} × {i.qty}
                                      <span className="text-slate-400">
                                        {" "}
                                        — {formatINR(i.monthly)}/mo
                                      </span>
                                    </p>
                                  ))}
                                  <p className="text-[13px] font-medium text-slate-900 pt-1 border-t border-slate-200 inline-block">
                                    Total {formatINR(order.totalMonthly)}/mo
                                  </p>
                                  {order.razorpayOrderId && (
                                    <p className="text-[11px] font-mono text-slate-400 break-all pt-1">
                                      {order.razorpayOrderId}
                                    </p>
                                  )}
                                  {order.screenshotUrl && (
                                    <button
                                      onClick={() => setLightboxUrl(order.screenshotUrl ?? null)}
                                      className="flex items-center gap-1.5 text-[13px] text-violet-600 hover:underline cursor-pointer"
                                    >
                                      <Maximize2 size={12} /> View payment screenshot
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    Actions
                                  </p>

                                  {unpaid && (
                                    <div className="flex gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-100 mb-1">
                                      <AlertTriangle
                                        size={14}
                                        className="text-rose-500 shrink-0 mt-0.5"
                                      />
                                      <p className="text-[12px] text-rose-700 leading-snug">
                                        Checkout was started but payment never completed. Approving
                                        grants a membership that was never paid for.
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex flex-wrap gap-2">
                                    {order.status === "pending" &&
                                      (confirmEmailKey === `approve:${order.id}` ? (
                                        <button
                                          onClick={() => {
                                            setConfirmEmailKey(null);
                                            approve(order);
                                          }}
                                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-[13px] font-medium hover:bg-emerald-700 cursor-pointer"
                                        >
                                          Confirm — send email
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => setConfirmEmailKey(`approve:${order.id}`)}
                                          className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-[13px] font-medium hover:bg-slate-700 cursor-pointer"
                                        >
                                          Approve
                                        </button>
                                      ))}

                                    {order.status === "pending" &&
                                      (confirmEmailKey === `reject:${order.id}` ? (
                                        <button
                                          onClick={() => {
                                            setConfirmEmailKey(null);
                                            reject(order);
                                          }}
                                          className="px-3 py-1.5 bg-rose-600 text-white rounded-md text-[13px] font-medium hover:bg-rose-700 cursor-pointer"
                                        >
                                          Confirm reject
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => setConfirmEmailKey(`reject:${order.id}`)}
                                          className="px-3 py-1.5 bg-white/70 border border-white/80 text-slate-600 rounded-md text-[13px] font-medium hover:bg-slate-50 cursor-pointer"
                                        >
                                          Reject
                                        </button>
                                      ))}

                                    {order.status === "approved" &&
                                      (AUTO_EMAIL_ENABLED ? (
                                        confirmEmailKey === `resend:${order.id}` ? (
                                          <button
                                            onClick={() => {
                                              setConfirmEmailKey(null);
                                              sendAutoEmail(order);
                                            }}
                                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-[13px] font-medium hover:bg-emerald-700 cursor-pointer"
                                          >
                                            Confirm resend
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => setConfirmEmailKey(`resend:${order.id}`)}
                                            className="px-3 py-1.5 bg-white/70 border border-white/80 text-slate-600 rounded-md text-[13px] font-medium hover:bg-slate-50 cursor-pointer"
                                          >
                                            Resend email
                                          </button>
                                        )
                                      ) : (
                                        <a
                                          href={confirmationMailto(order)}
                                          className="px-3 py-1.5 bg-white/70 border border-white/80 text-slate-600 rounded-md text-[13px] font-medium hover:bg-slate-50"
                                        >
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
                                          className="px-3 py-1.5 bg-amber-500 text-white rounded-md text-[13px] font-medium hover:bg-amber-600 cursor-pointer"
                                        >
                                          Confirm reminder
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => setConfirmEmailKey(`remind:${order.id}`)}
                                          className="px-3 py-1.5 bg-white/70 border border-white/80 text-slate-600 rounded-md text-[13px] font-medium hover:bg-slate-50 cursor-pointer"
                                        >
                                          Send reminder
                                        </button>
                                      ))}

                                    {deleteConfirmId === order.id ? (
                                      <button
                                        onClick={() => remove(order.id)}
                                        className="px-3 py-1.5 bg-rose-600 text-white rounded-md text-[13px] font-medium hover:bg-rose-700 cursor-pointer"
                                      >
                                        Confirm delete
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => setDeleteConfirmId(order.id)}
                                        className="px-3 py-1.5 bg-white/70 border border-white/80 text-slate-400 rounded-md text-[13px] font-medium hover:text-rose-600 hover:border-rose-200 cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment screenshot lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-5 right-5 w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close screenshot"
          >
            <X size={18} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Payment screenshot"
            className="max-w-[92vw] max-h-[88vh] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </main>
  );
}
