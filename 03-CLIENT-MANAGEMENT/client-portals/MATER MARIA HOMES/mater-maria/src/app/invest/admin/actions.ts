"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "mm_admin";
const JWT_SECRET = new TextEncoder().encode(
  process.env["ADMIN_JWT_SECRET"] || "fallback-secret-change-me"
);

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
  const adminPasswordHash = process.env["ADMIN_PASSWORD_HASH"];

  if (!adminPasswordHash) {
    return { error: "Admin access not configured. Set ADMIN_PASSWORD_HASH env var." };
  }

  const valid = await bcrypt.compare(password, adminPasswordHash);
  if (!valid) {
    return { error: "Invalid password" };
  }

  const token = await new SignJWT({ role: "admin", sub: "mater-maria-admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  redirect("/invest/admin");
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/invest/admin");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      clockTolerance: 60,
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
