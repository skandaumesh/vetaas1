"use client";

import { useEffect, useRef, useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";

/**
 * Asks the signed-in admin to re-enter their password before a destructive
 * action. The password is checked by Firebase Auth, never compared in the
 * browser, and a successful check refreshes the sign-in time that Firestore
 * rules require for deletes — so skipping this dialog from the dev console
 * doesn't get past the server.
 */
export default function PasswordConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setShow(false);
    setError(null);
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user?.email || !password) return;
    setBusy(true);
    setError(null);

    try {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
      // Make sure Firestore sends a token carrying the new sign-in time.
      await user.getIdToken(true);
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setError(
        code === "auth/too-many-requests"
          ? "Too many attempts. Please wait a few minutes and try again."
          : code === "auth/network-request-failed"
            ? "No internet connection. Please try again."
            : "Incorrect password."
      );
      setPassword("");
      setBusy(false);
      inputRef.current?.focus();
      return;
    }

    try {
      await onConfirm();
      setPassword("");
      onClose();
    } catch (err) {
      console.error("Confirmed action failed:", err);
      setError("That didn't work. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => !busy && onClose()}
        aria-hidden
      />
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-confirm-title"
        className="relative glass-solid rounded-3xl p-6 w-full max-w-sm shadow-xl"
      >
        <div className="w-11 h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <ShieldAlert size={22} />
        </div>
        <h2 id="password-confirm-title" className="text-lg font-extrabold text-[#111827]">
          {title}
        </h2>
        <div className="mt-1.5 text-sm text-slate-500 leading-relaxed">{message}</div>

        <label className="block mt-5 text-xs font-bold text-slate-500" htmlFor="password-confirm-input">
          Admin password
        </label>
        <div className="relative mt-1.5">
          <input
            id="password-confirm-input"
            ref={inputRef}
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            disabled={busy}
            className={`w-full pl-4 pr-11 py-3 rounded-xl border ${
              error ? "border-red-400" : "border-gray-200"
            } bg-white text-sm font-medium focus:outline-none focus:border-[#7C3AED] disabled:opacity-60`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {error && <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>}

        <div className="mt-6 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !password}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {busy && <Loader2 size={15} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
