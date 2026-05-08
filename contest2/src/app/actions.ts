"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactAction(formData: FormData) {
  const name = getValue(formData, "name");
  const email = getValue(formData, "email");
  const message = getValue(formData, "message");

  if (!name || !email || !message) {
    redirect("/?sent=0#contact");
  }

  await prisma.contactSubmission.create({
    data: {
      name,
      email,
      message,
    },
  });

  redirect("/?sent=1#contact");
}