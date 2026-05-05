"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 w-full"
    >
      <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 h-24 md:h-28 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 relative z-10">
          <Image
            src="/logo.webp"
            alt="Vetaas — The Tree of Hope"
            width={80}
            height={80}
            className="object-contain w-14 md:w-16 lg:w-[70px] h-auto"
            priority
          />
        </Link>

        {/* Desktop Links — Right aligned */}
        <nav className="hidden lg:flex items-center gap-14">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[1.25rem] font-semibold transition-colors ${
                  isActive
                    ? "text-[#0CB0D8]"
                    : "text-[#111827] hover:text-[#0CB0D8]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden relative z-10 text-[#111827] p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white border-b border-gray-200 shadow-xl px-6 pb-6 pt-4 flex flex-col gap-3"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg font-semibold py-3 px-4 rounded-xl transition-colors ${
                  isActive
                    ? "text-[#36ba98] bg-[#36ba98]/5"
                    : "text-[#111827] hover:bg-gray-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </motion.nav>
      )}
    </motion.header>
  );
}
