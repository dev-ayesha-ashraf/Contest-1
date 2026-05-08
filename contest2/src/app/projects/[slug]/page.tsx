import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatProjectDate } from "@/lib/formatters";
import { getProjectBySlug, getSiteData } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, siteData] = await Promise.all([getProjectBySlug(slug), getSiteData()]);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f9f3e8_0%,#efe5d4_100%)] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-black/10 bg-white/70 px-5 py-4 shadow-[0_18px_45px_rgba(19,34,38,0.08)] backdrop-blur-xl">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-600">
            {siteData.settings.siteTitle}
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-900/10 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            Back to portfolio
          </Link>
        </header>

        <section className="overflow-hidden rounded-[34px] border border-black/10 bg-white/72 shadow-[0_24px_60px_rgba(19,34,38,0.08)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[340px] border-b border-black/10 bg-[linear-gradient(135deg,rgba(24,60,67,0.94),rgba(212,111,77,0.62))] lg:min-h-[520px] lg:border-b-0 lg:border-r">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col justify-between p-8 text-[#f7f1e8] sm:p-10">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/70">
                    {project.category}
                  </span>
                  <div>
                    <p className="max-w-[13ch] text-4xl font-semibold leading-none tracking-tight sm:text-6xl">
                      {project.title}
                    </p>
                    <p className="mt-4 text-sm text-white/70 sm:text-base">
                      {formatProjectDate(project.projectDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-7 sm:p-10">
              <span className="eyebrow">Project detail</span>
              <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.04em] text-slate-950 sm:text-6xl">
                {project.title}
              </h1>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-[#f7f1e8] px-4 py-2">{project.category}</span>
                <span className="rounded-full bg-[#f7f1e8] px-4 py-2">
                  {formatProjectDate(project.projectDate)}
                </span>
              </div>
              <p className="mt-8 text-base leading-8 text-slate-600 sm:text-lg">
                {project.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-[#d46f4d]"
                >
                  Visit project link
                </a>
                <a
                  href="/admin/login"
                  className="inline-flex min-h-12 items-center rounded-full border border-slate-900/10 px-6 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  Manage in admin
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}