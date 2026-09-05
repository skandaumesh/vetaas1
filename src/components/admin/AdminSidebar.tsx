"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  ExternalLink,
  FileText,
  LogOut,
  Send,
  Users,
} from "lucide-react";

const NAV = [
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/memberships", label: "Memberships", icon: Users },
  { href: "/admin/quizzes", label: "Quizzes", icon: ClipboardList },
  { href: "/admin/forms", label: "Forms", icon: FileText },
  { href: "/admin/broadcast", label: "Broadcast", icon: Send },
  { href: "/admin/events", label: "Events", icon: Calendar },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) =>
      setUser(u && !u.isAnonymous ? u : null)
    );
    return () => unsubscribe();
  }, []);

  const links = NAV.map(({ href, label, icon: Icon }) => {
    const active = pathname?.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          active
            ? "bg-white/70 text-[#111827] shadow-sm"
            : "text-gray-500 hover:bg-white/50 hover:text-gray-800"
        }`}
      >
        <Icon size={17} className={active ? "text-[#7C3AED]" : ""} />
        {label}
      </Link>
    );
  });

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-60 flex-col bg-white/55 backdrop-blur-xl border-r border-white/70 z-40">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <Image src="/icon.png" alt="Vetaas" width={36} height={36} className="rounded-lg" />
          <div>
            <p className="font-extrabold text-[#111827] text-sm leading-tight">Vetaas</p>
            <p className="text-[11px] text-gray-400 font-semibold">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="px-4 pb-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Main menu
          </p>
          {links}
        </nav>

        <div className="px-3 py-4 border-t border-slate-200/70 space-y-1">
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1 rounded-xl bg-white/50">
              <span className="w-8 h-8 shrink-0 rounded-full bg-[#7C3AED] text-white text-xs font-semibold flex items-center justify-center uppercase">
                {(user.email ?? "?").charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-slate-800 truncate" title={user.email ?? undefined}>
                  {user.email}
                </p>
                <p className="text-[11px] text-slate-400">Administrator</p>
              </div>
            </div>
          )}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-white/50 hover:text-gray-800 transition-colors"
          >
            <ExternalLink size={16} />
            View website
          </Link>
          {user && (
            <button
              onClick={() => signOut(auth)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span className="truncate text-left">Sign out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/70 px-4 py-3 flex items-center gap-2">
        <Image src="/icon.png" alt="Vetaas" width={28} height={28} className="rounded-md" />
        <div className="flex gap-1 flex-1 justify-center">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                pathname?.startsWith(href)
                  ? "bg-[#111827] text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        {user && (
          <button
            onClick={() => signOut(auth)}
            className="text-gray-400 hover:text-red-500 cursor-pointer"
            aria-label="Sign out"
          >
            <LogOut size={17} />
          </button>
        )}
      </div>
    </>
  );
}
