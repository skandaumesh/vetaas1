"use client";

import { useEffect, useRef } from "react";
import EventBanner from "./EventBanner";
import Navbar from "./Navbar";

export default function Header() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateHeight = () => {
      const rect = element.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--header-height",
        `${rect.height}px`
      );
    };

    // Run initially
    updateHeight();

    // Use ResizeObserver to track dynamic height changes (e.g. banner dismiss animation)
    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(element);

    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div ref={ref} className="fixed top-0 inset-x-0 z-50">
      <EventBanner />
      <Navbar />
    </div>
  );
}
