import type { User } from "firebase/auth";

// The only accounts allowed into the admin panel. This is enforced here in the
// UI AND in the Firestore/Storage security rules (firestore.rules / storage.rules)
// — both must list the same emails. Being logged in is NOT enough; the account's
// email must be on this list. Keep the two in sync when changing admins.
export const ADMIN_EMAILS = ["kirti.vetaas@gmail.com"];

export function isAdminUser(user: User | null): boolean {
  const email = user?.email?.toLowerCase();
  return !!email && !user?.isAnonymous && ADMIN_EMAILS.includes(email);
}
