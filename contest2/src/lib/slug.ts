import { prisma } from "@/lib/prisma";

export function toProjectSlug(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project"
  );
}

export async function generateUniqueProjectSlug(title: string, excludeId?: string) {
  const baseSlug = toProjectSlug(title);
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existingProject = await prisma.project.findFirst({
      where: excludeId
        ? {
            slug: candidate,
            NOT: { id: excludeId },
          }
        : {
            slug: candidate,
          },
      select: { id: true },
    });

    if (!existingProject) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}