"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Lock, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart";

const WHATSAPP_NUMBER = "918951004160";

// One entry per card deck — add future decks here and they flow into the grid.
const DECKS = [
  {
    id: "conversation-7day",
    title: "7 Days of Conversation Cards",
    description:
      "One gentle question a day to open up conversations with your child.",
    cover: "/cards/day-1.png",
    coverAlt: "Day 1 card — What made you feel happy today?",
    totalCards: 7,
    price: 99,
  },
];

export default function CardsSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {DECKS.map((deck, i) => (
          <DeckCard key={deck.id} deck={deck} index={i} />
        ))}
      </div>
    </section>
  );
}

function DeckCard({ deck, index }: { deck: (typeof DECKS)[number]; index: number }) {
  const [showNotice, setShowNotice] = useState(false);
  const { items, add } = useCart();
  const inCart = items.some((i) => i.id === deck.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover="hover"
      className="flex"
    >
      <motion.div
        variants={{ hover: { y: -6 } }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="flex flex-col w-full rounded-[1.75rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
      >
        {/* ── Cover: the card photographed on a soft surface ── */}
        <div className="relative bg-[#f7f7f5] px-7 py-9 flex items-center justify-center">
          <motion.div
            variants={{ hover: { y: -5, rotate: -1.5 } }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="w-full rounded-xl overflow-hidden shadow-[0_10px_28px_-8px_rgba(0,0,0,0.22)]"
          >
            <Image
              src={deck.cover}
              alt={deck.coverAlt}
              width={411}
              height={290}
              sizes="(max-width: 768px) 100vw, 380px"
              className="w-full h-auto"
            />
          </motion.div>
        </div>

        {/* ── Details ── */}
        <div className="p-5 flex flex-col flex-grow">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7C3AED] mb-2.5">
            <Lock size={11} /> {deck.totalCards - 1} more cards inside
          </span>

          <h2 className="text-base md:text-lg font-extrabold text-[#111827] mb-1.5 leading-snug">
            {deck.title}
          </h2>
          <p className="text-gray-500 font-medium text-sm leading-relaxed flex-grow">
            {deck.description}
          </p>

          <div className="flex items-center justify-between mt-4 mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-[#111827]">₹{deck.price}</span>
              <span className="text-xs text-gray-400 font-semibold">one-time</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {deck.totalCards} cards · PDF
            </span>
          </div>

          {inCart ? (
            <Link
              href="/cart"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111827] text-white font-bold text-sm rounded-full shadow-md hover:bg-black transition-colors"
            >
              <Check size={15} />
              In cart — view cart
            </Link>
          ) : (
            <motion.button
              onClick={() =>
                add({
                  id: deck.id,
                  kind: "product",
                  name: deck.title,
                  price: deck.price,
                })
              }
              whileTap={{ scale: 0.98 }}
              variants={{ hover: { scale: 1.02 } }}
              className="group relative w-full overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7C3AED] text-white font-bold text-sm rounded-full shadow-md hover:bg-[#6D28D9] transition-colors cursor-pointer"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 blur-md -translate-x-full group-hover:translate-x-[500%] transition-transform duration-700" />
              <Lock size={15} className="relative" />
              <span className="relative">Unlock all {deck.totalCards} cards</span>
            </motion.button>
          )}

          {showNotice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3.5">
                <p className="text-xs text-amber-900 font-semibold leading-relaxed mb-1.5">
                  Online payment for this is coming soon.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hi Vetaas! I'd like to buy the "${deck.title}" set.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline"
                >
                  <MessageCircle size={13} />
                  WhatsApp us to purchase
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
