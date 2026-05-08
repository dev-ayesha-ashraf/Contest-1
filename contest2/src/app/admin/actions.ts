"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  clearAdminSession,
  requireAdminSession,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueProjectSlug } from "@/lib/slug";
import { deleteUploadedImage, saveUploadedImage } from "@/lib/upload";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseSortOrder(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseProjectDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdminSession();

  const data = {
    siteTitle: getValue(formData, "siteTitle"),
    siteSubtitle: getValue(formData, "siteSubtitle"),
    introTitle: getValue(formData, "introTitle"),
    introText: getValue(formData, "introText"),
    aboutTitle: getValue(formData, "aboutTitle"),
    aboutText: getValue(formData, "aboutText"),
    contactHeading: getValue(formData, "contactHeading"),
    contactBody: getValue(formData, "contactBody"),
    contactEmail: getValue(formData, "contactEmail"),
    contactPhone: getValue(formData, "contactPhone"),
    contactLocation: getValue(formData, "contactLocation"),
  };

  if (Object.values(data).some((value) => !value)) {
    redirect("/admin?error=settings");
  }

  const existingSettings = await prisma.siteSettings.findFirst();

  if (existingSettings) {
    await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data,
    });
  } else {
    await prisma.siteSettings.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?status=settings-saved");
}

export async function createSkillAction(formData: FormData) {
  await requireAdminSession();

  const name = getValue(formData, "name");
  const sortOrder = parseSortOrder(getValue(formData, "sortOrder"));

  if (!name) {
    redirect("/admin?error=skill");
  }

  await prisma.skill.create({
    data: {
      name,
      sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?status=skill-created");
}

export async function updateSkillAction(formData: FormData) {
  await requireAdminSession();

  const id = getValue(formData, "id");
  const name = getValue(formData, "name");
  const sortOrder = parseSortOrder(getValue(formData, "sortOrder"));

  if (!id || !name) {
    redirect("/admin?error=skill");
  }

  await prisma.skill.update({
    where: { id },
    data: {
      name,
      sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?status=skill-updated");
}

export async function deleteSkillAction(formData: FormData) {
  await requireAdminSession();

  const id = getValue(formData, "id");

  if (!id) {
    redirect("/admin?error=skill");
  }

  await prisma.skill.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?status=skill-deleted");
}

export async function createSocialLinkAction(formData: FormData) {
  await requireAdminSession();

  const label = getValue(formData, "label");
  const url = getValue(formData, "url");
  const sortOrder = parseSortOrder(getValue(formData, "sortOrder"));

  if (!label || !url) {
    redirect("/admin?error=social");
  }

  await prisma.socialLink.create({
    data: {
      label,
      url,
      sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?status=social-created");
}

export async function updateSocialLinkAction(formData: FormData) {
  await requireAdminSession();

  const id = getValue(formData, "id");
  const label = getValue(formData, "label");
  const url = getValue(formData, "url");
  const sortOrder = parseSortOrder(getValue(formData, "sortOrder"));

  if (!id || !label || !url) {
    redirect("/admin?error=social");
  }

  await prisma.socialLink.update({
    where: { id },
    data: {
      label,
      url,
      sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?status=social-updated");
}

export async function deleteSocialLinkAction(formData: FormData) {
  await requireAdminSession();

  const id = getValue(formData, "id");

  if (!id) {
    redirect("/admin?error=social");
  }

  await prisma.socialLink.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?status=social-deleted");
}

export async function createProjectAction(formData: FormData) {
  await requireAdminSession();

  const title = getValue(formData, "title");
  const description = getValue(formData, "description");
  const category = getValue(formData, "category");
  const projectLink = getValue(formData, "projectLink");
  const projectDate = parseProjectDate(getValue(formData, "projectDate"));
  const image = formData.get("image");

  if (!title || !description || !category || !projectLink || !projectDate) {
    redirect("/admin?error=project");
  }

  const slug = await generateUniqueProjectSlug(title);
  const imageUrl = image instanceof File ? await saveUploadedImage(image) : null;

  await prisma.project.create({
    data: {
      slug,
      title,
      description,
      category,
      projectLink,
      projectDate,
      imageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?status=project-created");
}

export async function updateProjectAction(formData: FormData) {
  await requireAdminSession();

  const id = getValue(formData, "id");
  const title = getValue(formData, "title");
  const description = getValue(formData, "description");
  const category = getValue(formData, "category");
  const projectLink = getValue(formData, "projectLink");
  const projectDate = parseProjectDate(getValue(formData, "projectDate"));
  const existingImageUrl = getValue(formData, "existingImageUrl");
  const removeImage = getValue(formData, "removeImage") === "on";
  const image = formData.get("image");

  if (!id || !title || !description || !category || !projectLink || !projectDate) {
    redirect("/admin?error=project");
  }

  const slug = await generateUniqueProjectSlug(title, id);
  let imageUrl: string | null = existingImageUrl || null;

  if (removeImage && existingImageUrl) {
    await deleteUploadedImage(existingImageUrl);
    imageUrl = null;
  }

  if (image instanceof File && image.size > 0) {
    imageUrl = await saveUploadedImage(image, removeImage ? null : existingImageUrl || null);
  }

  const existingProject = await prisma.project.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.project.update({
    where: { id },
    data: {
      slug,
      title,
      description,
      category,
      projectLink,
      projectDate,
      imageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  if (existingProject?.slug) {
    revalidatePath(`/projects/${existingProject.slug}`);
  }
  revalidatePath(`/projects/${slug}`);
  redirect("/admin?status=project-updated");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdminSession();

  const id = getValue(formData, "id");

  if (!id) {
    redirect("/admin?error=project");
  }

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      slug: true,
      imageUrl: true,
    },
  });

  if (!project) {
    redirect("/admin?error=project");
  }

  if (project.imageUrl) {
    await deleteUploadedImage(project.imageUrl);
  }

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/projects/${project.slug}`);
  redirect("/admin?status=project-deleted");
}