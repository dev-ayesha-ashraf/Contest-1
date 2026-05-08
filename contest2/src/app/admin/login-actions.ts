"use server";

import { redirect } from "next/navigation";

import { authenticateAdmin, createAdminSession } from "@/lib/auth";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(formData: FormData) {
  const email = getValue(formData, "email").toLowerCase();
  const password = getValue(formData, "password");

  if (!email || !password) {
    redirect("/admin/login?error=missing");
  }

  let adminSession: Awaited<ReturnType<typeof authenticateAdmin>> = null;
  try {
    adminSession = await authenticateAdmin(email, password);

    if (adminSession) {
      await createAdminSession(adminSession);
    }
  } catch (error) {
    console.error("Admin login failed", error);
    redirect("/admin/login?error=server");
  }

  if (!adminSession) {
    redirect("/admin/login?error=invalid");
  }

  redirect("/admin");
}