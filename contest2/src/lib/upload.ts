import "server-only";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const uploadsDirectory = path.join(process.cwd(), "public", "uploads");
const maxUploadSize = 5 * 1024 * 1024;

function sanitizeFilename(filename: string) {
  const extension = path.extname(filename) || ".png";
  const basename = path
    .basename(filename, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return `${basename || "project"}-${Date.now()}${extension.toLowerCase()}`;
}

export async function deleteUploadedImage(imageUrl?: string | null) {
  if (!imageUrl?.startsWith("/uploads/")) {
    return;
  }

  const filePath = path.join(process.cwd(), "public", imageUrl.replace(/^\//, ""));

  try {
    await unlink(filePath);
  } catch {
    // Ignore missing files so data cleanup does not fail.
  }
}

export async function saveUploadedImage(
  file: File | null,
  currentImageUrl?: string | null,
) {
  if (!file || file.size === 0) {
    return currentImageUrl ?? null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are allowed.");
  }

  if (file.size > maxUploadSize) {
    throw new Error("Image uploads must be 5MB or smaller.");
  }

  await mkdir(uploadsDirectory, { recursive: true });

  const filename = sanitizeFilename(file.name);
  const filePath = path.join(uploadsDirectory, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  if (currentImageUrl) {
    await deleteUploadedImage(currentImageUrl);
  }

  return `/uploads/${filename}`;
}