"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "mm_admin";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 8, // 8 hours
  path: "/invest/admin",
};

export async function adminLogin(
  _prevState: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const password = formData.get("password")?.toString() ?? "";
  const adminPassword = process.env["ADMIN_PASSWORD"];

  if (!adminPassword) {
    return { error: "Admin access not configured. Set ADMIN_PASSWORD env var." };
  }
  if (password !== adminPassword) {
    return { error: "Invalid password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "authenticated", COOKIE_OPTIONS);
  redirect("/invest/admin");
}

export async function adminLogout(_formData: FormData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/invest/admin");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === "authenticated";
}
