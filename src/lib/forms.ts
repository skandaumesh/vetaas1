// Shared types for the admin-authorable forms feature (admin builder,
// admin responses view, and the public fill page all import from here).

export type FieldType =
  | "short_text"
  | "paragraph"
  | "email"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "file_upload"
  | "image_upload"
  | "linear_scale"
  | "rating"
  | "mc_grid"
  | "checkbox_grid"
  | "date"
  | "time";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  /** Choices for multiple choice, checkboxes and drop-down. */
  options?: string[];
  /** Linear scale: lowest (0 or 1) and highest (2–10) value, and end labels. */
  scaleMin?: number;
  scaleMax?: number;
  minLabel?: string;
  maxLabel?: string;
  /** Rating: number of stars (3–10). */
  ratingMax?: number;
  /** Grids: every row is answered against the same set of columns. */
  rows?: string[];
  columns?: string[];
}

/** A grid answer maps each row label to its chosen column, or columns. */
export type GridAnswer = Record<string, string | string[]>;
export type AnswerValue = string | string[] | GridAnswer;

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
  value: AnswerValue;
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
  dropdown: "Drop-down",
  file_upload: "File upload",
  image_upload: "Image upload",
  linear_scale: "Linear scale",
  rating: "Rating",
  mc_grid: "Multiple-choice grid",
  checkbox_grid: "Tick box grid",
  date: "Date",
  time: "Time",
};

/** Question-type menu, grouped the way Google Forms groups it. */
export const FIELD_TYPE_GROUPS: { label: string; types: FieldType[] }[] = [
  { label: "Text", types: ["short_text", "paragraph", "email"] },
  { label: "Choice", types: ["multiple_choice", "checkboxes", "dropdown"] },
  { label: "Upload", types: ["file_upload", "image_upload"] },
  { label: "Scale", types: ["linear_scale", "rating"] },
  { label: "Grid", types: ["mc_grid", "checkbox_grid"] },
  { label: "Date & time", types: ["date", "time"] },
];

// Field types that need an options list (rendered as radio/checkbox/select).
export const OPTION_FIELD_TYPES: FieldType[] = ["multiple_choice", "checkboxes", "dropdown"];
export const GRID_FIELD_TYPES: FieldType[] = ["mc_grid", "checkbox_grid"];

/** What a file-upload question accepts. Mirrors formUploads in storage.rules. */
export const FILE_UPLOAD_ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,image/*";
export const FILE_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;

export function newFieldId(): string {
  return Math.random().toString(36).slice(2, 10);
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// Trimmed, blank-free, de-duplicated. Grid rows become keys of the answer map,
// and Firestore rejects an empty map key, so blanks can't be saved.
const cleanList = (list?: string[]) =>
  Array.from(new Set((list ?? []).map((s) => s.trim()).filter(Boolean)));

// Firestore rejects `undefined` anywhere in a document — keep only the
// settings that belong to the field's type, each with a defined value, so
// save() never sends an invalid value or leftovers from a previous type.
export function sanitizeField(field: FormField): FormField {
  const { id, label, required, type } = field;
  const out: FormField = { id, label, required, type };
  if (OPTION_FIELD_TYPES.includes(type)) out.options = cleanList(field.options);
  if (type === "linear_scale") {
    out.scaleMin = field.scaleMin === 0 ? 0 : 1;
    out.scaleMax = clamp(field.scaleMax ?? 5, 2, 10);
    out.minLabel = field.minLabel ?? "";
    out.maxLabel = field.maxLabel ?? "";
  }
  if (type === "rating") out.ratingMax = clamp(field.ratingMax ?? 5, 3, 10);
  if (GRID_FIELD_TYPES.includes(type)) {
    out.rows = cleanList(field.rows);
    out.columns = cleanList(field.columns);
  }
  return out;
}

/** Switches a field's type, keeping its question text and filling in defaults. */
export function withType(field: FormField, type: FieldType): FormField {
  const next = sanitizeField({ ...field, type });
  if (next.options && next.options.length === 0) next.options = ["Option 1"];
  if (next.rows && next.rows.length === 0) next.rows = ["Row 1"];
  if (next.columns && next.columns.length === 0) next.columns = ["Column 1"];
  return next;
}

export function emptyField(type: FieldType = "short_text"): FormField {
  return withType({ id: newFieldId(), type, label: "", required: false }, type);
}

/** The value submitted for a question the respondent left alone. */
export function emptyAnswer(field: FormField): AnswerValue {
  if (field.type === "checkboxes") return [];
  if (GRID_FIELD_TYPES.includes(field.type)) return {};
  return "";
}

/** Whether a required question counts as unanswered. A grid needs every row. */
export function isAnswerEmpty(field: FormField, value: AnswerValue | undefined): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  const rows = field.rows ?? [];
  if (rows.length === 0) return Object.keys(value).length === 0;
  return rows.some((row) => {
    const cell = value[row];
    if (cell === undefined) return true;
    return Array.isArray(cell) ? cell.length === 0 : cell.trim().length === 0;
  });
}

/** One-line text for any answer — used by the responses view and CSV export. */
export function formatAnswer(value: AnswerValue | undefined): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  return Object.entries(value)
    .map(([row, cell]) => `${row}: ${Array.isArray(cell) ? cell.join(", ") : cell}`)
    .join("; ");
}

/**
 * The original file name from a Firebase download URL. Uploads are stored as
 * `formUploads/<form>/<fieldId>-<timestamp>-<name>`, so that prefix is dropped.
 */
export function fileNameFromUrl(url: string): string {
  try {
    const encoded = new URL(url).pathname.split("/o/")[1] ?? "";
    const last = decodeURIComponent(encoded).split("/").pop() ?? "";
    return last.replace(/^[a-z0-9]+-[0-9]+-/i, "") || "Uploaded file";
  } catch {
    return "Uploaded file";
  }
}
