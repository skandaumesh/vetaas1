"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/AdminGate";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
  Mail,
  Phone,
  Search,
  ShoppingBag,
} from "lucide-react";

interface MembershipLine {
  plan: string;
  planId?: string;
  qty: number;
  monthly: number;
}
interface DigitalLine {
  id: string;
  name: string;
  price: number;
}
interface Order {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  membership?: MembershipLine[];
  digital?: DigitalLine[];
  total?: number;
  status?: "pending" | "paid";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  membershipOrderId?: string;
  createdAt?: Timestamp;
  paidAt?: Timestamp;
}

const FILTERS = [
  { key: "paid", label: "Paid" },
  { key: "pending", label: "Not paid" },
  { key: "all", label: "All" },
] as const;
type FilterKey = (typeof FILTERS)[number]["key"];

const inr = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;

const fmtDateTime = (t?: Timestamp) =>
  t
    ? t.toDate().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

/** Everything bought on one order, as a flat list of labels. */
const linesOf = (o: Order) => [
  ...(o.membership ?? []).map((m) => `${m.plan}${m.qty > 1 ? ` × ${m.qty}` : ""}`),
  ...(o.digital ?? []).map((d) => d.name),
];

export default function AdminOrdersPage() {
  const { user } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("paid");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(db, "orders"), orderBy("createdAt", "desc"))
        );
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order));
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const paid = useMemo(() => orders.filter((o) => o.status === "paid"), [orders]);

  // Units sold per product, paid orders only — an abandoned checkout isn't a sale.
  const productTally = useMemo(() => {
    const tally = new Map<string, { name: string; units: number; revenue: number }>();
    for (const o of paid) {
      for (const d of o.digital ?? []) {
        const row = tally.get(d.id) ?? { name: d.name, units: 0, revenue: 0 };
        row.units += 1;
        row.revenue += d.price || 0;
        tally.set(d.id, row);
      }
      for (const m of o.membership ?? []) {
        const key = `plan:${m.planId ?? m.plan}`;
        const row = tally.get(key) ?? { name: `${m.plan} membership`, units: 0, revenue: 0 };
        row.units += m.qty || 1;
        row.revenue += m.monthly || 0;
        tally.set(key, row);
      }
    }
    return [...tally.values()].sort((a, b) => b.units - a.units);
  }, [paid]);

  const revenue = useMemo(() => paid.reduce((sum, o) => sum + (o.total ?? 0), 0), [paid]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders
      .filter((o) => (filter === "all" ? true : (o.status ?? "pending") === filter))
      .filter((o) => {
        if (!term) return true;
        const haystack = [o.name, o.email, o.phone, ...linesOf(o)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
  }, [orders, filter, search]);

  const exportCsv = () => {
    const rows = [
      ["Date", "Name", "Email", "Phone", "Items", "Total", "Status", "Payment ID"],
      ...visible.map((o) => [
        fmtDateTime(o.createdAt),
        o.name ?? "",
        o.email ?? "",
        o.phone ?? "",
        linesOf(o).join("; "),
        String(o.total ?? 0),
        o.status ?? "pending",
        o.razorpayPaymentId ?? "",
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `vetaas-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pendingCount = orders.filter((o) => (o.status ?? "pending") === "pending").length;

  return (
    <main className="min-h-screen py-8 md:py-10 px-4 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-[2.15rem] font-semibold tracking-[-0.02em] text-slate-900">
              Orders <span className="text-slate-300">tracker</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Who bought what, and whether the payment came through.
            </p>
          </div>
          <button
            onClick={exportCsv}
            disabled={visible.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/70 border border-slate-200 text-slate-700 rounded-lg text-[13px] font-medium hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download size={15} /> Export CSV
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-slate-300" size={24} />
          </div>
        ) : (
          <>
            {/* Headline numbers */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden mb-6">
              {[
                { label: "Revenue", value: inr(revenue), sub: "paid orders" },
                { label: "Paid orders", value: String(paid.length), sub: "completed" },
                {
                  label: "Not paid",
                  value: String(pendingCount),
                  sub: "checkout abandoned",
                },
                {
                  label: "Items sold",
                  value: String(productTally.reduce((n, p) => n + p.units, 0)),
                  sub: "across all orders",
                },
              ].map((card) => (
                <div key={card.label} className="bg-white px-5 py-5">
                  <p className="text-[13px] font-medium text-slate-400 mb-3">{card.label}</p>
                  <p className="text-[2rem] font-semibold tabular-nums tracking-[-0.03em] leading-none mb-2 text-slate-900">
                    {card.value}
                  </p>
                  <p className="text-xs text-slate-300">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* What's selling */}
            <div className="glass-solid rounded-xl p-6 mb-6">
              <p className="text-[13px] font-medium text-slate-400 mb-5">What&apos;s selling</p>
              {productTally.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No paid orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {productTally.map((p) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-[13px] text-slate-700 flex-1 truncate">{p.name}</span>
                      <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden shrink-0">
                        <div
                          className="h-full rounded-full bg-violet-500"
                          style={{
                            width: `${Math.max(
                              2,
                              (p.units / productTally[0].units) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-[13px] font-medium text-slate-900 tabular-nums w-8 text-right shrink-0">
                        {p.units}
                      </span>
                      <span className="text-[13px] text-slate-400 tabular-nums w-16 text-right shrink-0">
                        {inr(p.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex bg-slate-100 rounded-lg p-0.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                      filter === f.key
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {f.label}
                    {f.key === "pending" && pendingCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, phone or product"
                  className="glass-input w-full rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Orders */}
            {visible.length === 0 ? (
              <div className="glass-solid rounded-xl p-12 text-center">
                <ShoppingBag className="mx-auto mb-3 text-slate-300" size={28} />
                <p className="text-sm text-slate-500">No orders match this view.</p>
              </div>
            ) : (
              <div className="glass-solid rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead>
                      <tr className="border-b border-slate-200/70">
                        {["Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                          <th
                            key={h}
                            className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 px-5 py-3"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((o) => {
                        const open = expanded === o.id;
                        const items = linesOf(o);
                        return (
                          <Fragment key={o.id}>
                            <tr
                              onClick={() => setExpanded(open ? null : o.id)}
                              className="border-b border-slate-100 hover:bg-white/60 cursor-pointer"
                            >
                              <td className="px-5 py-3.5">
                                <p className="text-[13px] font-semibold text-slate-900 truncate">
                                  {o.name || "—"}
                                </p>
                                <p className="text-[12px] text-slate-400 truncate">{o.email}</p>
                              </td>
                              <td className="px-5 py-3.5 text-[13px] text-slate-600">
                                {items.length === 0 ? "—" : items[0]}
                                {items.length > 1 && (
                                  <span className="text-slate-400"> +{items.length - 1}</span>
                                )}
                              </td>
                              <td className="px-5 py-3.5 text-[13px] font-semibold text-slate-900 tabular-nums">
                                {inr(o.total ?? 0)}
                              </td>
                              <td className="px-5 py-3.5">
                                <span
                                  className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    o.status === "paid"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {o.status === "paid" ? "Paid" : "Not paid"}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-[13px] text-slate-500 whitespace-nowrap">
                                {fmtDateTime(o.createdAt)}
                              </td>
                              <td className="px-5 py-3.5 text-slate-400">
                                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </td>
                            </tr>

                            {open && (
                              <tr className="bg-white/50">
                                <td colSpan={6} className="px-5 py-5">
                                  <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                        Ordered
                                      </p>
                                      <ul className="space-y-1.5">
                                        {(o.membership ?? []).map((m) => (
                                          <li
                                            key={m.plan}
                                            className="flex justify-between gap-4 text-[13px]"
                                          >
                                            <span className="text-slate-700">
                                              {m.plan} membership
                                              {m.qty > 1 && ` × ${m.qty}`}
                                            </span>
                                            <span className="text-slate-900 font-medium tabular-nums">
                                              {inr(m.monthly)}/mo
                                            </span>
                                          </li>
                                        ))}
                                        {(o.digital ?? []).map((d) => (
                                          <li
                                            key={d.id}
                                            className="flex justify-between gap-4 text-[13px]"
                                          >
                                            <span className="text-slate-700">{d.name}</span>
                                            <span className="text-slate-900 font-medium tabular-nums">
                                              {inr(d.price)}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div className="space-y-1.5 text-[13px]">
                                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                        Customer &amp; payment
                                      </p>
                                      {o.email && (
                                        <p className="flex items-center gap-2 text-slate-600">
                                          <Mail size={13} className="text-slate-400" />
                                          <a
                                            href={`mailto:${o.email}`}
                                            className="hover:text-violet-600 break-all"
                                          >
                                            {o.email}
                                          </a>
                                        </p>
                                      )}
                                      {o.phone && (
                                        <p className="flex items-center gap-2 text-slate-600">
                                          <Phone size={13} className="text-slate-400" />
                                          <a
                                            href={`tel:${o.phone}`}
                                            className="hover:text-violet-600"
                                          >
                                            {o.phone}
                                          </a>
                                        </p>
                                      )}
                                      {o.paidAt && (
                                        <p className="text-slate-500">
                                          Paid {fmtDateTime(o.paidAt)}
                                        </p>
                                      )}
                                      {o.razorpayPaymentId && (
                                        <p className="text-slate-400 font-mono text-[12px] break-all">
                                          {o.razorpayPaymentId}
                                        </p>
                                      )}
                                      {o.membershipOrderId && (
                                        <p className="text-slate-400 text-[12px]">
                                          Membership issued — see the Memberships page.
                                        </p>
                                      )}
                                      {o.status !== "paid" && (
                                        <p className="text-red-500 font-medium">
                                          Checkout started but never paid — nothing was sent.
                                        </p>
                                      )}
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
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
