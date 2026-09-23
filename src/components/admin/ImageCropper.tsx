"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Maximize2, Minus, Plus, X } from "lucide-react";

const SHAPES = [
  { label: "Wide 16:9", aspect: 16 / 9 },
  { label: "Square 1:1", aspect: 1 },
  { label: "Portrait 4:5", aspect: 4 / 5 },
];

/**
 * Crop and zoom a picture before it's uploaded. The frame is the part that
 * gets kept — the image is dragged and zoomed behind it, always covering it,
 * so a crop can never include empty edges.
 */
export default function ImageCropper({
  file,
  onCancel,
  onDone,
  defaultAspect = 16 / 9,
  aspects,
  title = "Crop image",
}: {
  file: File;
  onCancel: () => void;
  onDone: (blob: Blob, aspect: number) => void;
  defaultAspect?: number;
  /** Shapes to offer. One shape hides the chooser. Defaults to all three. */
  aspects?: number[];
  title?: string;
}) {
  const shapes = aspects
    ? SHAPES.filter((s) => aspects.some((a) => Math.abs(a - s.aspect) < 0.001))
    : SHAPES;
  const [src, setSrc] = useState<string | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [aspect, setAspect] = useState(defaultAspect);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const points = useRef<Map<number, { x: number; y: number }>>(new Map());

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new window.Image();
    img.onload = () => setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Re-centre when the shape changes, so the new frame starts on the middle.
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  }, [aspect]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const frame = () => {
    const el = frameRef.current;
    return el ? { w: el.clientWidth, h: el.clientHeight } : null;
  };

  /** Scale at which the image exactly covers the frame. */
  const coverScale = () => {
    const f = frame();
    if (!f || !natural) return 1;
    return Math.max(f.w / natural.w, f.h / natural.h);
  };

  // Keeps the frame filled: the image can't be dragged past its own edges.
  const clamp = (next: { x: number; y: number }, atZoom = zoom) => {
    const f = frame();
    if (!f || !natural) return next;
    const total = coverScale() * atZoom;
    const maxX = Math.max(0, (natural.w * total - f.w) / 2);
    const maxY = Math.max(0, (natural.h * total - f.h) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  };

  const changeZoom = (value: number) => {
    const next = Math.min(5, Math.max(1, value));
    setZoom(next);
    setOffset((o) => clamp(o, next));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (points.current.size === 2) {
      const [a, b] = [...points.current.values()];
      pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom };
      drag.current = null;
    } else {
      drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!points.current.has(e.pointerId)) return;
    points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinch.current && points.current.size === 2) {
      const [a, b] = [...points.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      changeZoom(pinch.current.zoom * (distance / pinch.current.distance));
      return;
    }
    if (!drag.current) return;
    setOffset(
      clamp({
        x: drag.current.ox + (e.clientX - drag.current.x),
        y: drag.current.oy + (e.clientY - drag.current.y),
      })
    );
  };

  const onPointerUp = (e: React.PointerEvent) => {
    points.current.delete(e.pointerId);
    if (points.current.size < 2) pinch.current = null;
    if (points.current.size === 0) drag.current = null;
  };

  const apply = async () => {
    const f = frame();
    if (!f || !natural || !src) return;
    setSaving(true);
    try {
      const total = coverScale() * zoom;
      // The frame, converted back into a rectangle on the original picture.
      const cropW = Math.min(natural.w, f.w / total);
      const cropH = Math.min(natural.h, f.h / total);
      const cropX = Math.max(0, Math.min(natural.w - cropW, natural.w / 2 - offset.x / total - cropW / 2));
      const cropY = Math.max(0, Math.min(natural.h - cropH, natural.h / 2 - offset.y / total - cropH / 2));

      const MAX = 1400;
      const outW = Math.round(Math.min(cropW, MAX));
      const outH = Math.round(outW * (cropH / cropW));

      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not read the image"));
        img.src = src;
      });

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, outW, outH);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );
      if (!blob) throw new Error("Could not save the crop");
      onDone(blob, outW / outH);
    } catch (err) {
      console.error("Crop failed:", err);
      setSaving(false);
    }
  };

  const total = coverScale() * zoom;

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-lg max-h-[95vh] flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-bold text-[#111827]">{title}</p>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          <div className={`flex flex-wrap gap-2 ${shapes.length > 1 ? "mb-4" : ""}`}>
            {(shapes.length > 1 ? shapes : []).map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setAspect(s.aspect)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  Math.abs(aspect - s.aspect) < 0.001
                    ? "bg-[#7C3AED] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div
            ref={frameRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={(e) => {
              e.preventDefault();
              changeZoom(zoom * (e.deltaY < 0 ? 1.08 : 0.93));
            }}
            onDragStart={(e) => e.preventDefault()}
            draggable={false}
            style={{ aspectRatio: String(aspect), maxWidth: `calc(52vh * ${aspect})` }}
            className="crop-surface relative mx-auto w-full overflow-hidden rounded-2xl bg-slate-100 touch-none cursor-grab active:cursor-grabbing select-none"
          >
            {src && natural ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  width: natural.w * total,
                  height: natural.h * total,
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                }}
                className="absolute left-1/2 top-1/2 max-w-none pointer-events-none"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}
            {/* Thirds guide, drawn over the kept area */}
            <div className="absolute inset-0 pointer-events-none border-2 border-white/80 rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset]">
              <div className="absolute inset-y-0 left-1/3 w-px bg-white/30" />
              <div className="absolute inset-y-0 left-2/3 w-px bg-white/30" />
              <div className="absolute inset-x-0 top-1/3 h-px bg-white/30" />
              <div className="absolute inset-x-0 top-2/3 h-px bg-white/30" />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => changeZoom(zoom - 0.2)}
              aria-label="Zoom out"
              className="w-8 h-8 shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={1}
              max={5}
              step={0.01}
              value={zoom}
              onChange={(e) => changeZoom(Number(e.target.value))}
              aria-label="Zoom"
              className="flex-grow accent-[#7C3AED] cursor-pointer"
            />
            <button
              type="button"
              onClick={() => changeZoom(zoom + 0.2)}
              aria-label="Zoom in"
              className="w-8 h-8 shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-600 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Fit
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Drag the picture to move it, pinch or scroll to zoom. Everything inside the frame is kept.
          </p>
        </div>

        <div className="shrink-0 flex gap-2 justify-end px-5 py-4 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={apply}
            disabled={!natural || saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Use this crop
          </button>
        </div>
      </div>
    </div>
  );
}
