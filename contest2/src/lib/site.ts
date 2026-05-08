import "server-only";

import { prisma } from "@/lib/prisma";

const defaultSiteSettings = {
  siteTitle: "Ayesha Portfolio",
  siteSubtitle: "Designer • Developer • Problem Solver",
  introTitle:
    "Building polished digital work with sharp visual judgment and practical systems thinking.",
  introText:
    "I design and build modern portfolio, brand, and product experiences that feel editorial, fast, and intentional across every screen size.",
  aboutTitle: "About Me",
  aboutText:
    "I work across product design, front-end implementation, and content strategy. My process focuses on clarity, performance, and expressive visual systems that still stay easy to maintain after launch.",
  contactHeading: "Let’s build something that looks considered and performs cleanly.",
  contactBody:
    "Use the form below for new projects, freelance work, or collaboration requests. I usually reply within one business day.",
  contactEmail: "hello@ayesha-portfolio.com",
  contactPhone: "+92 300 0000000",
  contactLocation: "Lahore, Pakistan",
} as const;

const defaultSkills = [
  {
    id: "dummy-skill-ui-design",
    name: "UI Design",
    sortOrder: 1,
    createdAt: new Date("2025-01-10T00:00:00.000Z"),
    updatedAt: new Date("2025-01-10T00:00:00.000Z"),
  },
  {
    id: "dummy-skill-front-end",
    name: "Front-End Development",
    sortOrder: 2,
    createdAt: new Date("2025-01-11T00:00:00.000Z"),
    updatedAt: new Date("2025-01-11T00:00:00.000Z"),
  },
  {
    id: "dummy-skill-brand",
    name: "Brand Systems",
    sortOrder: 3,
    createdAt: new Date("2025-01-12T00:00:00.000Z"),
    updatedAt: new Date("2025-01-12T00:00:00.000Z"),
  },
  {
    id: "dummy-skill-responsive",
    name: "Responsive Design",
    sortOrder: 4,
    createdAt: new Date("2025-01-13T00:00:00.000Z"),
    updatedAt: new Date("2025-01-13T00:00:00.000Z"),
  },
  {
    id: "dummy-skill-seo",
    name: "SEO Foundations",
    sortOrder: 5,
    createdAt: new Date("2025-01-14T00:00:00.000Z"),
    updatedAt: new Date("2025-01-14T00:00:00.000Z"),
  },
  {
    id: "dummy-skill-stack",
    name: "Laravel / Next.js",
    sortOrder: 6,
    createdAt: new Date("2025-01-15T00:00:00.000Z"),
    updatedAt: new Date("2025-01-15T00:00:00.000Z"),
  },
];

const defaultSocialLinks = [
  {
    id: "dummy-social-linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com",
    sortOrder: 1,
    createdAt: new Date("2025-01-10T00:00:00.000Z"),
    updatedAt: new Date("2025-01-10T00:00:00.000Z"),
  },
  {
    id: "dummy-social-behance",
    label: "Behance",
    url: "https://behance.net",
    sortOrder: 2,
    createdAt: new Date("2025-01-11T00:00:00.000Z"),
    updatedAt: new Date("2025-01-11T00:00:00.000Z"),
  },
  {
    id: "dummy-social-github",
    label: "GitHub",
    url: "https://github.com",
    sortOrder: 3,
    createdAt: new Date("2025-01-12T00:00:00.000Z"),
    updatedAt: new Date("2025-01-12T00:00:00.000Z"),
  },
  {
    id: "dummy-social-instagram",
    label: "Instagram",
    url: "https://instagram.com",
    sortOrder: 4,
    createdAt: new Date("2025-01-13T00:00:00.000Z"),
    updatedAt: new Date("2025-01-13T00:00:00.000Z"),
  },
];

const defaultProjects = [
  {
    id: "dummy-project-editorial",
    slug: "editorial-commerce-refresh",
    title: "Editorial Commerce Refresh",
    description:
      "A conversion-focused redesign for a lifestyle marketplace with modular campaign storytelling, faster page load performance, and a clearer customer path from discovery to purchase.",
    category: "Brand Experience",
    projectDate: new Date("2026-03-14T00:00:00.000Z"),
    projectLink: "https://example.com/editorial-commerce-refresh",
    imageUrl: "/dummy/project-1.svg",
    createdAt: new Date("2026-03-14T00:00:00.000Z"),
    updatedAt: new Date("2026-03-14T00:00:00.000Z"),
  },
  {
    id: "dummy-project-dashboard",
    slug: "studio-booking-dashboard",
    title: "Studio Booking Dashboard",
    description:
      "A scheduling and availability dashboard for a creative studio, built around quick team coordination, visual timelines, and fewer manual handoffs across project operations.",
    category: "Product Design",
    projectDate: new Date("2025-11-02T00:00:00.000Z"),
    projectLink: "https://example.com/studio-booking-dashboard",
    imageUrl: "/dummy/project-2.svg",
    createdAt: new Date("2025-11-02T00:00:00.000Z"),
    updatedAt: new Date("2025-11-02T00:00:00.000Z"),
  },
  {
    id: "dummy-project-travel",
    slug: "luxury-travel-launch-site",
    title: "Luxury Travel Launch Site",
    description:
      "A premium campaign site that pairs immersive storytelling with SEO-aware content architecture to support a new destination collection and international acquisition campaigns.",
    category: "Marketing Site",
    projectDate: new Date("2025-08-19T00:00:00.000Z"),
    projectLink: "https://example.com/luxury-travel-launch-site",
    imageUrl: "/dummy/project-3.svg",
    createdAt: new Date("2025-08-19T00:00:00.000Z"),
    updatedAt: new Date("2025-08-19T00:00:00.000Z"),
  },
];

const projectImageFallbackBySlug: Record<string, string> = {
  "editorial-commerce-refresh": "/dummy/project-1.svg",
  "studio-booking-dashboard": "/dummy/project-2.svg",
  "luxury-travel-launch-site": "/dummy/project-3.svg",
};

function withFallbackProjectImages<T extends { slug: string; imageUrl: string | null }>(
  projects: T[],
): T[] {
  return projects.map((project) => ({
    ...project,
    imageUrl: project.imageUrl ?? projectImageFallbackBySlug[project.slug] ?? "/dummy/project-1.svg",
  }));
}

function applyFallbackIfEmpty<T>(items: T[], fallbackItems: T[]) {
  return items.length > 0 ? items : fallbackItems;
}

async function getSiteSettingsOrDefault() {
  const existingSettings = await prisma.siteSettings.findFirst();

  if (existingSettings) {
    return existingSettings;
  }

  return defaultSiteSettings;
}

export async function getSiteData() {
  try {
    const [settings, skills, socialLinks, projects] = await Promise.all([
      getSiteSettingsOrDefault(),
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
      skills: applyFallbackIfEmpty(skills, defaultSkills),
      socialLinks: applyFallbackIfEmpty(socialLinks, defaultSocialLinks),
      projects: withFallbackProjectImages(applyFallbackIfEmpty(projects, defaultProjects)),
    };
  } catch (error) {
    console.error("Failed to load site data from database", error);

    return {
      settings: defaultSiteSettings,
      skills: defaultSkills,
      socialLinks: defaultSocialLinks,
      projects: withFallbackProjectImages(defaultProjects),
    };
  }
}

export async function getAdminDashboardData() {
  try {
    const [settings, skills, socialLinks, projects, submissions] = await Promise.all([
      getSiteSettingsOrDefault(),
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
      skills: applyFallbackIfEmpty(skills, defaultSkills),
      socialLinks: applyFallbackIfEmpty(socialLinks, defaultSocialLinks),
      projects: withFallbackProjectImages(applyFallbackIfEmpty(projects, defaultProjects)),
      submissions,
    };
  } catch (error) {
    console.error("Failed to load admin dashboard data from database", error);

    return {
      settings: defaultSiteSettings,
      skills: defaultSkills,
      socialLinks: defaultSocialLinks,
      projects: withFallbackProjectImages(defaultProjects),
      submissions: [],
    };
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (project) {
      return withFallbackProjectImages([project])[0];
    }

    return defaultProjects.find((defaultProject) => defaultProject.slug === slug) ?? null;
  } catch (error) {
    console.error("Failed to load project by slug", error);
    return defaultProjects.find((defaultProject) => defaultProject.slug === slug) ?? null;
  }
}