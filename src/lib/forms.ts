// Shared types for the admin-authorable forms feature (admin builder,
// admin responses view, and the public fill page all import from here).

export type FieldType =
  | "short_text"
  | "paragraph"
  | "email"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "image_upload";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
}

export interface FormDoc {
  title: string;
  description: string;
  fields: FormField[];
  status: "open" | "closed";
  /** Cover image, shown square on the public page. */
  logoUrl?: string;
  limitOneResponse?: boolean;
  // Optional event details. When eventDate is set the public page shows a
  // date/time row; when location is set it shows a location row. All of it
  // degrades cleanly to a plain form when left blank.
  eventDate?: string; // "2026-09-05"
  eventStart?: string; // "11:00"
  eventEnd?: string; // "12:15"
  location?: string;
  locationNote?: string;
  hostName?: string;
  /** Label on the button that opens the questions. Defaults to "Register". */
  ctaLabel?: string;
  /**
   * Ticket price in whole rupees. 0 or absent means free. The server reads
   * this from Firestore when creating the Razorpay order — the browser never
   * gets to say what the registration costs.
   */
  price?: number;
  createdAt?: { seconds: number };
  updatedAt?: { seconds: number };
}

export interface FormAnswer {
  fieldId: string;
  label: string;
  value: string | string[];
}

export interface FormResponseDoc {
  formId: string;
  formTitle: string;
  answers: FormAnswer[];
  // Present only on paid events. Written by the createEventRegistration Cloud
  // Function; "pending" means the Razorpay order was created but the payment
  // hasn't been confirmed yet.
  paymentStatus?: "pending" | "paid";
  amount?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: { seconds: number };
  createdAt?: { seconds: number };
}

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  short_text: "Short answer",
  paragraph: "Paragraph",
  email: "Email",
  multiple_choice: "Multiple choice",
  checkboxes: "Checkboxes",
  dropdown: "Dropdown",
  image_upload: "Image upload",
};

// Field types that need an options list (rendered as radio/checkbox/select).
export const OPTION_FIELD_TYPES: FieldType[] = ["multiple_choice", "checkboxes", "dropdown"];

export function newFieldId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyField(type: FieldType = "short_text"): FormField {
  const base = { id: newFieldId(), type, label: "", required: false };
  return OPTION_FIELD_TYPES.includes(type) ? { ...base, options: ["Option 1"] } : base;
}

// Firestore rejects `undefined` anywhere in a document — strip `options`
// entirely for field types that don't use it instead of setting it to
// undefined, so save() never sends an invalid value.
export function sanitizeField(field: FormField): FormField {
  if (!OPTION_FIELD_TYPES.includes(field.type)) {
    const { options, ...rest } = field;
    return rest as FormField;
  }
  return field;
}
