"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, ArrowRight } from "lucide-react";

function ContactFormContent() {
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const eventName = searchParams.get("event") || "";

  const defaultMessage = eventName 
    ? `I would like to register for the event: ${eventName}`
    : "";

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#faf9f6]"
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      {/* ── Background SVG Doodles (mirror of HeroSection) ── */}

      {/* Paper Airplane + dashed loop — top left */}
      <div className="absolute top-[8%] left-[3%] w-44 h-44 pointer-events-none z-0">
        <svg viewBox="0 0 150 150" fill="none" className="w-full h-full">
          <path
            d="M 15,110 C 10,80 60,70 50,50 C 40,30 15,45 30,65 C 45,85 85,55 105,40"
            stroke="#ffd166"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 6"
          />
          <g transform="translate(100, 25) rotate(-15)">
            <path
              d="M 0,15 L 30,0 L 20,30 L 12,20 Z"
              fill="none"
              stroke="#1a4895"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M 30,0 L 12,20" stroke="#1a4895" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* Navy dot grid — top right */}
      <div className="absolute top-[10%] right-[6%] opacity-80 pointer-events-none z-0">
        <svg width="56" height="42" viewBox="0 0 80 60" fill="#1a4895">
          {[10, 30, 50, 70].map((cx) =>
            [10, 30, 50].map((cy) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
            ))
          )}
        </svg>
      </div>

      {/* Coral dot grid — mid left */}
      <div className="absolute top-[50%] left-[3%] opacity-75 pointer-events-none z-0">
        <svg width="36" height="36" viewBox="0 0 60 60" fill="#ff6e79">
          {[10, 30, 50].map((cx) =>
            [10, 30, 50].map((cy) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
            ))
          )}
        </svg>
      </div>

      {/* Blue zigzag — bottom left */}
      <div className="absolute bottom-[18%] left-[5%] w-20 h-10 pointer-events-none z-0">
        <svg
          viewBox="0 0 80 30"
          fill="none"
          stroke="#1a4895"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M 0,15 L 12,5 L 24,25 L 36,5 L 48,25 L 60,5 L 72,15" />
        </svg>
      </div>

      {/* Half-circle yellow sun — right boundary */}
      <div className="absolute top-[65%] right-0 translate-x-[50%] w-20 h-20 pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="#ffd166" className="w-full h-full">
          <circle cx="50" cy="50" r="50" />
        </svg>
      </div>

      {/* Soft flowing background curves */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M-50,300 C300,500 700,100 1100,380 C1250,470 1380,220 1500,300"
            stroke="#1a4895"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.05"
          />
          <path
            d="M-50,500 C200,300 550,600 900,400 C1150,250 1350,500 1500,440"
            stroke="#36ba98"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="10 8"
            opacity="0.05"
          />
        </svg>
      </div>

      {/* ── Navy bottom wave (exactly like HeroSection) ── */}
      <div className="absolute bottom-0 left-0 w-full h-[90px] sm:h-[110px] md:h-[130px] pointer-events-none z-0">
        <svg
          viewBox="0 0 600 120"
          preserveAspectRatio="none"
          className="w-full h-full text-[#1a4895]"
        >
          <path
            d="M 0,90 C 80,110 160,115 220,105 C 300,90 400,60 480,70 C 520,75 560,95 600,90 L 600,120 L 0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ── Page Content ── */}
      <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 pt-[calc(var(--header-height)+4rem)] pb-48">

        {/* ── Hero header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-20 text-center md:text-left"
        >
          {/* Pill badge */}
          <span className="inline-block py-1.5 px-5 rounded-full bg-white border border-[#1a4895]/10 text-[#1a4895] font-bold text-[10px] tracking-[0.2em] uppercase shadow-sm mb-5">
            Get in Touch
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] text-[#111827] tracking-tight mb-5">
            Let's Build the{" "}
            <span className="text-[#36ba98]">Village</span>
            <br className="hidden sm:block" /> Together.
          </h1>
          <p className="text-gray-500 text-base sm:text-lg font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
            Whether you're a school, a parent, or a volunteer — we'd love to hear from you.
          </p>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">

          {/* ── LEFT: Contact info ── */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <InfoCard
              icon={<Phone size={22} />}
              color="#1a4895"
              label="Call Us"
              href="tel:+918951004160"
              value="+91 89510 04160"
            />
            <InfoCard
              icon={<Mail size={22} />}
              color="#36ba98"
              label="Email Us"
              href="mailto:kirti.vetaas@gmail.com"
              value="kirti.vetaas@gmail.com"
            />
            <InfoCard
              icon={<MapPin size={22} />}
              color="#ff6e79"
              label="Visit Us"
              value="Bangalore, India"
            />

            {/* Decorative quote */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 bg-[#1a4895] text-white rounded-3xl p-8 relative overflow-hidden"
            >
              {/* inner doodle */}
              <div className="absolute -top-4 -right-4 w-24 h-24 opacity-10">
                <svg viewBox="0 0 100 100" fill="white" className="w-full h-full">
                  <circle cx="50" cy="50" r="50" />
                </svg>
              </div>
              <p className="text-lg font-semibold leading-relaxed relative z-10">
                "It takes a village to raise a child."
              </p>
              <p className="text-white/60 text-sm mt-3 font-medium relative z-10">
                — African Proverb &amp; our founding belief
              </p>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-black/5 border border-gray-100">
              {/* Form header */}
              <div className="mb-8">
                <span className="inline-block py-1 px-4 rounded-full bg-[#36ba98]/10 text-[#2a9d7e] text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                  Send a Message
                </span>
                <h2 className="text-3xl font-bold text-[#111827] leading-tight">
                  We reply within 24 hours.
                </h2>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#36ba98]/10 flex items-center justify-center text-[#36ba98] text-3xl mb-2">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-[#111827]">Message Sent!</h3>
                  <p className="text-gray-500 font-medium">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm font-bold text-[#1a4895] underline underline-offset-4 hover:text-[#36ba98] transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form
                  action="mailto:kirti.vetaas@gmail.com"
                  method="POST"
                  encType="text/plain"
                  onSubmit={() => setSubmitted(true)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field id="name" label="Your Name" type="text" placeholder="Jane Doe" />
                    <Field id="email" label="Email Address" type="email" placeholder="jane@example.com" />
                  </div>
                  <Field id="phone" label="Phone (optional)" type="tel" placeholder="+91 98765 43210" />
                  <Field id="role" label="I am a…" type="select" options={["Parent", "School / Principal", "Teacher", "Volunteer", "Other"]} />
                  <Field id="message" label="Your Message" type="textarea" placeholder="How can we help you?" defaultValue={defaultMessage} />

                  <button
                    type="submit"
                    className="w-full bg-[#1a4895] text-white font-bold text-sm py-4 px-8 rounded-full flex items-center justify-center gap-2 hover:bg-[#153a7a] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-2"
                  >
                    Send Message <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}

/* ── Info Card ── */
function InfoCard({
  icon,
  color,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-5 bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <div>
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 block mb-0.5">
          {label}
        </span>
        <p className="text-[#111827] font-bold text-base leading-snug">{value}</p>
      </div>
      {href && (
        <ArrowRight
          size={16}
          className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors"
        />
      )}
    </div>
  );

  return href ? <a href={href}>{content}</a> : <div>{content}</div>;
}

/* ── Form Field ── */
function Field({
  id,
  label,
  type,
  placeholder,
  options,
  defaultValue,
}: {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}) {
  const base =
    "w-full bg-[#faf9f6] border border-gray-200 rounded-2xl px-5 py-4 text-sm font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a4895]/20 focus:border-[#1a4895]/30 transition-all";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={id}
          rows={4}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`${base} resize-none`}
        />
      ) : type === "select" ? (
        <select id={id} name={id} className={base} defaultValue={defaultValue || ""}>
          <option value="" disabled>
            Select one…
          </option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={base}
        />
      )}
    </div>
  );
}

function ContactLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f6] flex items-center justify-center z-10" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#1a4895]/20 border-t-[#1a4895] animate-spin" />
        <p className="text-sm font-bold text-[#1a4895] uppercase tracking-[0.2em] animate-pulse">Loading Contact Form...</p>
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactLoading />}>
      <ContactFormContent />
    </Suspense>
  );
}
