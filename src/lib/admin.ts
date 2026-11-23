import type { User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { collection, getDocsFromServer, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AdminAccess = "admin" | "not-admin" | "offline";

/**
 * Whether a signed-in account may use the admin panel.
 *
 * The list of admins lives only on the server — in firestore.rules,
 * storage.rules and functions/index.js — so this asks rather than knowing:
 * it reads one record that the rules give to admins alone. Keeping a copy of
 * the list here would ship the exact accounts to attack to every visitor's
 * browser.
 */
export async function checkAdminAccess(user: User | null): Promise<AdminAccess> {
  if (!user || user.isAnonymous) return "not-admin";
  try {
    await getDocsFromServer(query(collection(db, "membershipOrders"), limit(1)));
    return "admin";
  } catch (err) {
    return err instanceof FirebaseError && err.code === "permission-denied" ? "not-admin" : "offline";
  }
}
