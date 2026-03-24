import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Get the current session on the server side.
 * Redirects to login if not authenticated.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Get the current session without redirecting.
 */
export async function getSession() {
  return await auth();
}
