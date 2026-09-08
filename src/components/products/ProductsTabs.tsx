"use client";

import { useEffect, useState } from "react";
import QuizzesSection from "./QuizzesSection";
import WorksheetsSection from "./WorksheetsSection";
import CardsSection from "./CardsSection";

const TABS = [
  { id: "assessments", label: "Self-Assessments" },
  { id: "worksheets", label: "Worksheets" },
  { id: "cards", label: "Conversation Cards" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const isTabId = (value: string): value is TabId =>
  TABS.some((tab) => tab.id === value);

export default function ProductsTabs() {
  const [active, setActive] = useState<TabId>("assessments");

  // Keep the open tab in the URL hash so a refresh (or a shared link) lands
  // back on the same tab instead of resetting to Self-Assessments.
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (isTabId(hash)) setActive(hash);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const selectTab = (id: TabId) => {
    setActive(id);
    // replaceState rather than setting location.hash, which would scroll the page
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="pt-[calc(var(--header-height)+2.5rem)]">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="max-w-3xl mb-8">
          <span className="inline-block py-1.5 px-5 rounded-full bg-white border border-gray-200 text-[#7C3AED] font-bold text-[10px] tracking-[0.2em] uppercase shadow-sm mb-5">
            Free Resources
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#111827] leading-[1.15] tracking-tight">
            Not sure where to start? Explore our{" "}
            <span className="text-[#7C3AED]">self-assessments and worksheets.</span>
          </h1>
          <p className="text-gray-500 font-medium text-base md:text-lg mt-5 leading-relaxed">
            Short, reflective tools and printable activities for parents and children — simple ways
            to notice where you are and discover gentle next steps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                active === tab.id
                  ? "bg-[#7C3AED] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {active === "assessments" && <QuizzesSection />}
      {active === "worksheets" && <WorksheetsSection />}
      {active === "cards" && <CardsSection />}
    </div>
  );
}
