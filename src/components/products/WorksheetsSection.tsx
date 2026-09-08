"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Flower2, Heart, PawPrint, Plus, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCart } from "@/lib/cart";

// Keep in step with DIGITAL_PRODUCTS in functions/index.js — that copy is
// what actually gets charged.
const WORKSHEET_PRICE = 49;

type Worksheet = {
  title: string;
  description: string;
  id: string;
  cover: string;
  coverW: number;
  coverH: number;
  accent: string;
  tint: string;
  icon: LucideIcon;
  /** Overrides WORKSHEET_PRICE for a single sheet when one is priced apart. */
  price?: number;
};

const WORKSHEETS: Worksheet[] = [
  {
    title: "My Kindness Journal",
    description:
      "A simple activity for children to notice and record their own acts of kindness, with reward stickers to celebrate them.",
    id: "worksheet-kindness-journal",
    cover: "/worksheets/covers/kindness-journal.webp",
    coverW: 900,
    coverH: 636,
    accent: "#00CDBA",
    tint: "#effcf9",
    icon: Heart,
  },
  {
    title: "Seasons' Diary",
    description:
      "A cut-and-paste activity exploring what children see and do across summer, monsoon, winter, and spring.",
    id: "worksheet-seasons-diary",
    cover: "/worksheets/covers/seasons-diary.webp",
    coverW: 900,
    coverH: 636,
    accent: "#268bff",
    tint: "#eef6ff",
    icon: Sun,
  },
  {
    title: "My Garden & Seasons Colouring",
    description:
      "Cut-and-paste garden pieces, design a garden of your own, and colour the things you'd see in summer and winter.",
    id: "worksheet-garden-seasons",
    cover: "/worksheets/covers/seasons-diary-2.webp",
    coverW: 636,
    coverH: 900,
    accent: "#FF5C7A",
    tint: "#fff0f2",
    icon: Flower2,
  },
  {
    title: "Match Animals with Their Food",
    description:
      "A fun tracing activity that matches each animal to the food it eats — panda to bamboo, monkey to banana, and more.",
    id: "worksheet-animals-match",
    cover: "/worksheets/covers/animals-match.webp",
    coverW: 900,
    coverH: 636,
    accent: "#FFC107",
    tint: "#fffaeb",
    icon: PawPrint,
  },
];

export default function WorksheetsSection() {
  const { items, add } = useCart();
  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {WORKSHEETS.map((sheet, i) => {
          const Icon = sheet.icon;
          return (
            <motion.div
              key={sheet.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex"
            >
              <div
                className="flex flex-col w-full rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden"
                style={{ backgroundColor: sheet.tint }}
              >
                {/* Same treatment as the card decks: the sheet sits on the
                    card's own surface at its natural proportions with a soft
                    drop shadow, rather than boxed into a fixed frame. */}
                <div className="px-6 pt-7 pb-1 flex items-center justify-center">
                  {/* Height-capped so the one portrait sheet doesn't tower over
                      the landscape ones; the box hugs whatever shape results. */}
                  <div className="rounded-xl overflow-hidden bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.22)]">
                    <Image
                      src={sheet.cover}
                      alt={`First page of ${sheet.title}`}
                      width={sheet.coverW}
                      height={sheet.coverH}
                      sizes="(max-width: 640px) 80vw, 300px"
                      className="w-auto h-auto max-h-44 max-w-full object-contain"
                    />
                  </div>
                </div>

                <div className="p-8 pt-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="flex items-center justify-center w-12 h-12 rounded-2xl text-white shadow-sm"
                    style={{ backgroundColor: sheet.accent }}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="text-lg font-extrabold text-[#111827]">
                    &#8377;{sheet.price ?? WORKSHEET_PRICE}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-extrabold text-[#111827] mb-3 leading-snug">
                  {sheet.title}
                </h2>
                <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed flex-grow">
                  {sheet.description}
                </p>

                {/* No direct link to the PDF: the file lives in Cloud Storage,
                    not /public, and is only ever handed out as a post-payment
                    link. */}
                <div className="mt-8">
                  <button
                    onClick={() =>
                      add({
                        id: sheet.id,
                        kind: "product",
                        name: sheet.title,
                        price: sheet.price ?? WORKSHEET_PRICE,
                      })
                    }
                    disabled={items.some((i) => i.id === sheet.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold shadow-md hover:brightness-105 transition-all disabled:opacity-60 cursor-pointer"
                    style={{ backgroundColor: sheet.accent }}
                  >
                    {items.some((i) => i.id === sheet.id) ? (
                      <>
                        <Check size={15} /> In cart
                      </>
                    ) : (
                      <>
                        <Plus size={15} /> Add to cart
                      </>
                    )}
                  </button>
                </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
