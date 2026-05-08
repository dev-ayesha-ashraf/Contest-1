import "server-only";

import { prisma } from "@/lib/prisma";

async function ensureSiteSettings() {
  const existingSettings = await prisma.siteSettings.findFirst();

  if (existingSettings) {
    return existingSettings;
  }

  return prisma.siteSettings.create({
    data: {
      siteTitle: "Ayesha Portfolio",
      siteSubtitle: "Designer • Developer • Problem Solver",
      introTitle:
        "Building polished digital work with sharp visual judgment and practical systems thinking.",
      introText:
        "I design and build modern portfolio, brand, and product experiences that feel editorial, fast, and intentional across every screen size.",
      aboutTitle: "About Me",
      aboutText:
        "I work across product design, front-end implementation, and content strategy. My process focuses on clarity, performance, and expressive visual systems that still stay easy to maintain after launch.",
      contactHeading:
        "Let’s build something that looks considered and performs cleanly.",
      contactBody:
        "Use the form below for new projects, freelance work, or collaboration requests. I usually reply within one business day.",
      contactEmail: "hello@ayesha-portfolio.com",
      contactPhone: "+92 300 0000000",
      contactLocation: "Lahore, Pakistan",
    },
  });
}

export async function getSiteData() {
  const [settings, skills, socialLinks, projects] = await Promise.all([
    ensureSiteSettings(),
    prisma.skill.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.socialLink.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.project.findMany({
      orderBy: [{ projectDate: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return {
    settings,
    skills,
    socialLinks,
    projects,
  };
}

export async function getAdminDashboardData() {
  const [settings, skills, socialLinks, projects, submissions] = await Promise.all([
    ensureSiteSettings(),
    prisma.skill.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.socialLink.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.project.findMany({
      orderBy: [{ projectDate: "desc" }, { createdAt: "desc" }],
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    settings,
    skills,
    socialLinks,
    projects,
    submissions,
  };
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
  });
}