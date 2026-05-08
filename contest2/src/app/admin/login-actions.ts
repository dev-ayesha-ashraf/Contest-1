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

  const adminSession = await authenticateAdmin(email, password);

  if (!adminSession) {
    redirect("/admin/login?error=invalid");
  }

  await createAdminSession(adminSession);
  redirect("/admin");
}