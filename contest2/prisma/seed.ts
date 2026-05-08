import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultProjects = [
  {
    title: "Editorial Commerce Refresh",
    slug: "editorial-commerce-refresh",
    description:
      "A conversion-focused redesign for a lifestyle marketplace with modular campaign storytelling, faster page load performance, and a clearer customer path from discovery to purchase.",
    category: "Brand Experience",
    projectDate: new Date("2026-03-14"),
    projectLink: "https://example.com/editorial-commerce-refresh",
    imageUrl: "/dummy/project-1.svg",
  },
  {
    title: "Studio Booking Dashboard",
    slug: "studio-booking-dashboard",
    description:
      "A scheduling and availability dashboard for a creative studio, built around quick team coordination, visual timelines, and fewer manual handoffs across project operations.",
    category: "Product Design",
    projectDate: new Date("2025-11-02"),
    projectLink: "https://example.com/studio-booking-dashboard",
    imageUrl: "/dummy/project-2.svg",
  },
  {
    title: "Luxury Travel Launch Site",
    slug: "luxury-travel-launch-site",
    description:
      "A premium campaign site that pairs immersive storytelling with SEO-aware content architecture to support a new destination collection and international acquisition campaigns.",
    category: "Marketing Site",
    projectDate: new Date("2025-08-19"),
    projectLink: "https://example.com/luxury-travel-launch-site",
    imageUrl: "/dummy/project-3.svg",
  },
];

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@portfolio.local").toLowerCase();
  const adminName = process.env.ADMIN_NAME ?? "Ayesha";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const existingSettings = await prisma.siteSettings.findFirst();

  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteTitle: "Ayesha Portfolio",
        siteSubtitle: "Designer • Developer • Problem Solver",
        introTitle: "Building polished digital work with sharp visual judgment and practical systems thinking.",
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
      },
    });
  }

  if ((await prisma.skill.count()) === 0) {
    await prisma.skill.createMany({
      data: [
        { name: "UI Design", sortOrder: 1 },
        { name: "Front-End Development", sortOrder: 2 },
        { name: "Brand Systems", sortOrder: 3 },
        { name: "Responsive Design", sortOrder: 4 },
        { name: "SEO Foundations", sortOrder: 5 },
        { name: "Laravel / Next.js", sortOrder: 6 },
      ],
    });
  }

  if ((await prisma.socialLink.count()) === 0) {
    await prisma.socialLink.createMany({
      data: [
        { label: "LinkedIn", url: "https://linkedin.com", sortOrder: 1 },
        { label: "Behance", url: "https://behance.net", sortOrder: 2 },
        { label: "GitHub", url: "https://github.com", sortOrder: 3 },
        { label: "Instagram", url: "https://instagram.com", sortOrder: 4 },
      ],
    });
  }

  for (const project of defaultProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        description: project.description,
        category: project.category,
        projectDate: project.projectDate,
        projectLink: project.projectLink,
        imageUrl: project.imageUrl,
      },
      create: project,
    });
  }

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
    },
  });

  console.log(`Admin user ready: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });