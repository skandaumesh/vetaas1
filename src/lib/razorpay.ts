// Razorpay Checkout loader and the shapes its callbacks hand back.
//
// The script is fetched once per page and reused; if another component on the
// page already loaded it, the `window.Razorpay` check short-circuits.

let razorpayScriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if ((window as unknown as { Razorpay?: unknown }).Razorpay) return Promise.resolve();
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpayFailedEvent {
  error?: { description?: string };
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (e: RazorpayFailedEvent) => void) => void;
}

export function openRazorpay(options: RazorpayOptions): RazorpayInstance {
  const Razorpay = (window as unknown as {
    Razorpay: new (o: RazorpayOptions) => RazorpayInstance;
  }).Razorpay;
  return new Razorpay(options);
}
