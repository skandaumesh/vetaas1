"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert, X, XCircle } from "lucide-react";

export interface ScanResult {
  tone: "ok" | "warn" | "error" | "busy";
  title: string;
  detail?: string;
}

type Detector = { detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]> };
type DetectorCtor = {
  new (options: { formats: string[] }): Detector;
  getSupportedFormats?: () => Promise<string[]>;
};

/**
 * Full-screen camera that reads QR codes. Uses the browser's built-in
 * BarcodeDetector where there is one (Chrome on Android) and falls back to
 * jsQR elsewhere (Safari on iPhone). Every decoded value goes to onDetected;
 * the parent decides what it means and passes back a result to show.
 */
export default function TicketScanner({
  onDetected,
  onClose,
  result,
}: {
  onDetected: (text: string) => void;
  onClose: () => void;
  result: ScanResult | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onDetectedRef = useRef(onDetected);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let stream: MediaStream | null = null;
    let raf = 0;
    let stopped = false;
    let busy = false;
    let last = 0;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("This browser can't open the camera. Use the guest list to check people in.");
        setStarting(false);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
      } catch (err) {
        const name = (err as { name?: string }).name;
        setCameraError(
          name === "NotAllowedError"
            ? "Camera access is blocked. Allow the camera for this site in your browser settings, or check people in from the guest list."
            : "Couldn't open the camera. Check people in from the guest list instead."
        );
        setStarting(false);
        return;
      }
      if (stopped) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      video.srcObject = stream;
      await video.play().catch(() => {});
      setStarting(false);

      let detector: Detector | null = null;
      const Ctor = (window as unknown as { BarcodeDetector?: DetectorCtor }).BarcodeDetector;
      if (Ctor) {
        try {
          const formats = Ctor.getSupportedFormats ? await Ctor.getSupportedFormats() : ["qr_code"];
          if (formats.includes("qr_code")) detector = new Ctor({ formats: ["qr_code"] });
        } catch {}
      }
      const jsQR = detector ? null : (await import("jsqr")).default;

      const tick = async (now: number) => {
        if (stopped) return;
        if (!busy && now - last > 180 && video.readyState >= 2 && video.videoWidth > 0) {
          last = now;
          busy = true;
          try {
            let text: string | null = null;
            if (detector) {
              const codes = await detector.detect(video);
              text = codes[0]?.rawValue ?? null;
            } else if (jsQR && ctx) {
              const scale = Math.min(1, 720 / video.videoWidth);
              canvas.width = Math.round(video.videoWidth * scale);
              canvas.height = Math.round(video.videoHeight * scale);
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
              text = jsQR(image.data, image.width, image.height, { inversionAttempts: "dontInvert" })?.data ?? null;
            }
            if (text) onDetectedRef.current(text);
          } catch {}
          busy = false;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toneClass = {
    ok: "bg-emerald-500 text-white",
    warn: "bg-amber-400 text-slate-900",
    error: "bg-red-500 text-white",
    busy: "bg-white text-slate-700",
  };
  const ToneIcon = { ok: CheckCircle2, warn: TriangleAlert, error: XCircle, busy: Loader2 };

  return (
    <div className="fixed inset-0 z-[9990] bg-black flex flex-col">
      <video ref={videoRef} playsInline muted autoPlay className="absolute inset-0 w-full h-full object-cover" />

      <div className="relative flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 bg-gradient-to-b from-black/70 to-transparent">
        <p className="text-white font-bold">Scan tickets</p>
        <button
          onClick={onClose}
          aria-label="Close scanner"
          className="w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center pointer-events-none">
        {cameraError ? (
          <p className="mx-6 max-w-sm text-center text-sm font-medium text-white bg-white/10 rounded-2xl p-5">
            {cameraError}
          </p>
        ) : starting ? (
          <Loader2 className="animate-spin text-white/80" size={32} />
        ) : (
          <div className="w-64 h-64 max-w-[70vw] max-h-[70vw] rounded-3xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
        )}
      </div>

      <div className="relative px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {result ? (
          <div className={`rounded-2xl px-5 py-4 flex items-start gap-3 shadow-lg ${toneClass[result.tone]}`} role="status" aria-live="polite">
            {(() => {
              const Icon = ToneIcon[result.tone];
              return <Icon size={24} className={`shrink-0 ${result.tone === "busy" ? "animate-spin" : ""}`} />;
            })()}
            <div className="min-w-0">
              <p className="font-bold text-lg leading-snug">{result.title}</p>
              {result.detail && <p className="text-sm opacity-90 mt-0.5">{result.detail}</p>}
            </div>
          </div>
        ) : (
          !cameraError && (
            <p className="text-center text-sm font-medium text-white/85">Point the camera at a ticket QR code</p>
          )
        )}
      </div>
    </div>
  );
}
