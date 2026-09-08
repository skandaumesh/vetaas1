"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function CartButton({ className = "" }: { className?: string }) {
  const { count, ready } = useCart();
  const [bump, setBump] = useState(false);
  const previous = useRef(count);

  useEffect(() => {
    // Skip the first pass: restoring a saved cart isn't the same as adding to
    // it, and popping on every page load would just be noise.
    if (!ready) {
      previous.current = count;
      return;
    }
    if (count > previous.current) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 600);
      previous.current = count;
      return () => clearTimeout(timer);
    }
    previous.current = count;
  }, [count, ready]);

  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full text-[#111827] hover:bg-black/5 transition-colors ${
        bump ? "cart-ring" : ""
      } ${className}`}
    >
      <span className={bump ? "cart-pop" : undefined}>
        <ShoppingBag size={20} />
      </span>
      {/* Hidden until the stored cart has loaded, so the badge never flashes
          the wrong number on first paint. */}
      {ready && count > 0 && (
        <span
          className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF5C7A] text-white text-[10px] font-bold flex items-center justify-center tabular-nums ${
            bump ? "cart-pop" : ""
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
