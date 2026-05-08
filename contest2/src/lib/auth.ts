import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const sessionCookieName = "portfolio_admin_session";
const sessionDurationSeconds = 60 * 60 * 12;
const encoder = new TextEncoder();

export type AdminSession = {
  userId: string;
  email: string;
  name: string | null;
};

function getEnvironmentAdminCredentials() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@portfolio.local").trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD ?? "ChangeMe123!").trim();
  const name = (process.env.ADMIN_NAME ?? "Ayesha").trim() || "Ayesha";

  return {
    email,
    password,
    name,
  };
}

function authenticateUsingEnvironmentCredentials(
  email: string,
  password: string,
): AdminSession | null {
  const fallbackAdmin = getEnvironmentAdminCredentials();

  if (!fallbackAdmin) {
    return null;
  }

  if (email.toLowerCase() !== fallbackAdmin.email || password !== fallbackAdmin.password) {
    return null;
  }

  return {
    userId: "env-admin",
    email: fallbackAdmin.email,
    name: fallbackAdmin.name,
  };
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET ?? "development-session-secret-change-me";
  return encoder.encode(secret);
}

export async function authenticateAdmin(email: string, password: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!adminUser) {
      return authenticateUsingEnvironmentCredentials(email, password);
    }

    const passwordMatches = await bcrypt.compare(password, adminUser.passwordHash);

    if (!passwordMatches) {
      return authenticateUsingEnvironmentCredentials(email, password);
    }

    return {
      userId: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
    } satisfies AdminSession;
  } catch (error) {
    console.error("Database auth lookup failed, using environment fallback", error);
    return authenticateUsingEnvironmentCredentials(email, password);
  }
}

export async function createAdminSession(session: AdminSession) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000);
  const token = await new SignJWT({
    email: session.email,
    name: session.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getSessionSecret());

  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(sessionCookieName)?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, getSessionSecret());

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }

    return {
      userId: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : null,
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}