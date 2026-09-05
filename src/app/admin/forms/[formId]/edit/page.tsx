"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/AdminGate";
import {
  FIELD_TYPE_LABELS,
  OPTION_FIELD_TYPES,
  emptyField,
  sanitizeField,
  type FieldType,
  type FormDoc,
  type FormField,
} from "@/lib/forms";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  ImageUp,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

const FIELD_TYPES = Object.keys(FIELD_TYPE_LABELS) as FieldType[];

export default function EditFormPage() {
  const { user } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const formId = params.formId as string;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [limitOneResponse, setLimitOneResponse] = useState(false);
  // Optional event details, shown on the public page above the form.
  const [eventDate, setEventDate] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [location, setLocation] = useState("");
  const [locationNote, setLocationNote] = useState("");
  const [hostName, setHostName] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "forms", formId));
        if (!snap.exists()) {
          setNotFound(true);
          return;
        }
        const data = snap.data() as FormDoc;
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setFields(data.fields ?? []);
        setLogoUrl(data.logoUrl ?? "");
        setLimitOneResponse(data.limitOneResponse ?? false);
        setEventDate(data.eventDate ?? "");
        setEventStart(data.eventStart ?? "");
        setEventEnd(data.eventEnd ?? "");
        setLocation(data.location ?? "");
        setLocationNote(data.locationNote ?? "");
        setHostName(data.hostName ?? "");
        setCtaLabel(data.ctaLabel ?? "");
        setPrice(data.price ? String(data.price) : "");
      } catch (err) {
        console.error("Failed to load form:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, formId]);

  const uploadLogo = async (file: File) => {
    setUploadingLogo(true);
    try {
      const ext = file.name.split(".").pop() ?? "png";
      const ref = storageRef(storage, `formLogos/${formId}.${ext}`);
      await uploadBytes(ref, file);
      const url = await getDownloadURL(ref);
      setLogoUrl(url);
    } catch (err) {
      console.error("Failed to upload logo:", err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const updateField = (id: string, patch: Partial<FormField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const setFieldType = (id: string, type: FieldType) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        return sanitizeField({
          ...f,
          type,
          options: OPTION_FIELD_TYPES.includes(type) ? f.options ?? ["Option 1"] : undefined,
        });
      })
    );
  };

  const addField = () => setFields((prev) => [...prev, emptyField()]);
  const removeField = (id: string) => setFields((prev) => prev.filter((f) => f.id !== id));
  const moveField = (index: number, dir: -1 | 1) => {
    setFields((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addOption = (fieldId: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? { ...f, options: [...(f.options ?? []), `Option ${(f.options?.length ?? 0) + 1}`] }
          : f
      )
    );
  };
  const updateOption = (fieldId: string, index: number, value: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? { ...f, options: (f.options ?? []).map((o, i) => (i === index ? value : o)) }
          : f
      )
    );
  };
  const removeOption = (fieldId: string, index: number) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === fieldId ? { ...f, options: (f.options ?? []).filter((_, i) => i !== index) } : f
      )
    );
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "forms", formId), {
        title: title.trim() || "Untitled form",
        description: description.trim(),
        fields: fields.map(sanitizeField),
        logoUrl,
        limitOneResponse,
        eventDate: eventDate.trim(),
        eventStart: eventStart.trim(),
        eventEnd: eventEnd.trim(),
        location: location.trim(),
        locationNote: locationNote.trim(),
        hostName: hostName.trim(),
        ctaLabel: ctaLabel.trim(),
        price: Math.max(0, Math.round(Number(price) || 0)),
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      console.error("Failed to save form:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#7C3AED]" size={28} />
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500 font-medium">This form doesn&apos;t exist.</p>
        <Link href="/admin/forms" className="text-sm font-bold text-[#7C3AED]">
          Back to Forms
        </Link>
      </main>
    );
  }

  // Same rule the public page uses: a date or location makes it an event, and
  // events show the cover as a square rather than a wide banner.
  const coverIsSquare = !!(eventDate.trim() || location.trim());

  return (
    <main className="min-h-screen py-8 md:py-10 px-4 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/admin/forms"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={15} /> Forms
          </Link>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] text-white rounded-full text-sm font-bold hover:bg-[#6D28D9] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : saved ? (
              <Check size={16} />
            ) : null}
            {saved ? "Saved" : "Save"}
          </button>
        </div>

        {/* Cover image. The preview is cropped to the same shape the public
            page will use — square for events, wide banner otherwise — so what
            you see here is what people actually get. */}
        <div className="glass-card rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Cover"
                  className={`${
                    coverIsSquare ? "w-28 h-28" : "w-44 h-[4.4rem]"
                  } object-cover rounded-xl border border-gray-200`}
                />
              ) : (
                <div
                  className={`${
                    coverIsSquare ? "w-28 h-28" : "w-44 h-[4.4rem]"
                  } rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-300`}
                >
                  <ImageUp size={20} />
                </div>
              )}
            </div>

            <div className="flex-grow min-w-0">
              <p className="text-sm font-bold text-[#111827]">Cover image (optional)</p>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {coverIsSquare
                  ? "Cropped to a square beside the title. Square images look best."
                  : "Cropped to a wide banner across the top. Add a date or location to switch this to a square."}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border border-white/70 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer">
                  {uploadingLogo ? <Loader2 size={13} className="animate-spin" /> : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadLogo(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                {logoUrl && (
                  <button
                    onClick={() => setLogoUrl("")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-gray-400 hover:text-red-500 rounded-full text-xs font-bold cursor-pointer"
                  >
                    <X size={13} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Title + description */}
        <div className="glass-card rounded-2xl p-6 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Form title"
            className="w-full text-xl font-extrabold text-[#111827] placeholder:text-gray-300 focus:outline-none mb-3"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full text-sm text-gray-600 font-medium placeholder:text-gray-300 focus:outline-none resize-none"
          />
          <label className="flex items-center gap-2.5 mt-4 pt-4 border-t border-gray-100 text-sm font-semibold text-gray-600 cursor-pointer w-max">
            <input
              type="checkbox"
              checked={limitOneResponse}
              onChange={(e) => setLimitOneResponse(e.target.checked)}
              className="rounded accent-[#7C3AED]"
            />
            Limit to one response per person
          </label>
          {limitOneResponse && (
            <p className="text-xs text-slate-300 mt-1.5 ml-6">
              Remembered on their device after submitting — doesn&apos;t stop a different device or a cleared browser.
            </p>
          )}
        </div>

        {/* Event details — all optional; each row only appears publicly if filled */}
        <div className="glass-card rounded-2xl p-6 mb-4">
          <p className="text-sm font-bold text-[#111827] mb-1">Event details</p>
          <p className="text-xs text-slate-300 mb-5">
            Only for events. Adding a date or location turns this into an event page — cover
            image beside the title, and the questions behind a Register button. Leave both
            blank for a normal form (feedback, information, sign-ups) where the questions show
            straight away.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Date
              </span>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-gray-700"
              />
            </label>
            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Start time
              </span>
              <input
                type="time"
                value={eventStart}
                onChange={(e) => setEventStart(e.target.value)}
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-gray-700"
              />
            </label>
            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                End time
              </span>
              <input
                type="time"
                value={eventEnd}
                onChange={(e) => setEventEnd(e.target.value)}
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-gray-700"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Location
              </span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="The Nest"
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300"
              />
            </label>
            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Address line
              </span>
              <input
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
                placeholder="J. P. Nagar, Bengaluru"
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Presented by
              </span>
              <input
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Vetaas Education Foundation"
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300"
              />
            </label>
            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Button label
              </span>
              <input
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="Register"
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300"
              />
            </label>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="block max-w-xs">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Ticket price (₹)
              </span>
              <input
                type="number"
                min={0}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300"
              />
            </label>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {Number(price) > 0
                ? `People pay ₹${Number(price).toLocaleString("en-IN")} through Razorpay before their place is confirmed. Money settles to the Vetaas account.`
                : "Leave at 0 for a free event — people just fill the form."}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {fields.map((field, i) => (
            <div key={field.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <input
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  placeholder="Question"
                  className="flex-grow font-semibold text-[#111827] placeholder:text-gray-300 border-b border-gray-200 pb-2 focus:outline-none focus:border-[#7C3AED]"
                />
                <select
                  value={field.type}
                  onChange={(e) => setFieldType(field.id, e.target.value as FieldType)}
                  className="text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {FIELD_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>

              {OPTION_FIELD_TYPES.includes(field.type) && (
                <div className="space-y-2 mb-4 pl-1">
                  {(field.options ?? []).map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <span className="text-gray-300 text-sm">
                        {field.type === "checkboxes" ? "☐" : "○"}
                      </span>
                      <input
                        value={opt}
                        onChange={(e) => updateOption(field.id, oi, e.target.value)}
                        className="flex-grow text-sm text-gray-700 font-medium border-b border-transparent hover:border-gray-200 focus:border-[#7C3AED] focus:outline-none py-1"
                      />
                      <button
                        onClick={() => removeOption(field.id, oi)}
                        className="text-gray-300 hover:text-red-500 cursor-pointer"
                        aria-label="Remove option"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(field.id)}
                    className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] cursor-pointer"
                  >
                    + Add option
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="rounded accent-[#7C3AED]"
                  />
                  Required
                </label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveField(i, -1)}
                    disabled={i === 0}
                    className="inline-flex items-center justify-center w-7 h-7 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                    aria-label="Move up"
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    onClick={() => moveField(i, 1)}
                    disabled={i === fields.length - 1}
                    className="inline-flex items-center justify-center w-7 h-7 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                    aria-label="Move down"
                  >
                    <ChevronDown size={15} />
                  </button>
                  <button
                    onClick={() => removeField(field.id)}
                    className="inline-flex items-center justify-center w-7 h-7 text-gray-400 hover:text-red-500 cursor-pointer"
                    aria-label="Delete question"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addField}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-dashed border-gray-300 text-gray-500 rounded-2xl text-sm font-bold hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add question
        </button>
      </div>
    </main>
  );
}
