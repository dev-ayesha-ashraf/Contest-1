import Image from "next/image";
import Link from "next/link";

import { submitContactAction } from "@/app/actions";
import { formatProjectDate } from "@/lib/formatters";
import { getSiteData } from "@/lib/site";

type HomePageProps = {
  searchParams: Promise<{
    sent?: string;
  }>;
};

function ProjectCard({
  title,
  category,
  date,
  description,
  href,
  imageUrl,
}: {
  title: string;
  category: string;
  date: Date;
  description: string;
  href: string;
  imageUrl: string | null;
}) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-black/10 bg-white/75 shadow-[0_24px_60px_rgba(19,34,38,0.08)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden border-b border-black/8 bg-[linear-gradient(135deg,rgba(24,60,67,0.92),rgba(212,111,77,0.64))]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col justify-between p-6 text-[#f7f1e8]">
            <span className="text-xs uppercase tracking-[0.3em] text-white/70">
              {category}
            </span>
            <div>
              <p className="max-w-[18rem] text-2xl font-semibold leading-tight">
                {title}
              </p>
              <p className="mt-2 text-sm text-white/70">{formatProjectDate(date)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>{category}</span>
          <span>{formatProjectDate(date)}</span>
        </div>
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h3>
          <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex min-h-11 items-center rounded-full border border-slate-900/10 px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
        >
          View project
        </Link>
      </div>
    </article>
  );
}

export default async function Home({ searchParams }: HomePageProps) {
  const [{ settings, skills, socialLinks, projects }, params] = await Promise.all([
    getSiteData(),
    searchParams,
  ]);
  const contactSent = params.sent === "1";

  return (
    <main className="page-shell">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-black/10 bg-white/65 px-5 py-4 shadow-[0_18px_45px_rgba(19,34,38,0.08)] backdrop-blur-xl">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-600">
          {settings.siteTitle}
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#portfolio">Projects</a>
          <a href="#contact">Contact</a>
          <Link
            href="/admin/login"
            className="rounded-full border border-slate-900/10 px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            Admin login
          </Link>
        </nav>
      </header>

      <section className="hero-panel" id="top">
        <div className="hero-copy">
          <span className="eyebrow">{settings.siteSubtitle}</span>
          <h1>{settings.introTitle}</h1>
          <p>{settings.introText}</p>
          <div className="hero-actions">
            <a className="button-primary" href="#portfolio">
              Explore projects
            </a>
            <a className="button-secondary" href="#contact">
              Start a conversation
            </a>
          </div>
          <div className="grid gap-3 pt-4 sm:grid-cols-3">
            <div className="rounded-[22px] border border-black/10 bg-white/60 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Projects</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{projects.length}</p>
            </div>
            <div className="rounded-[22px] border border-black/10 bg-white/60 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Skills</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{skills.length}</p>
            </div>
            <div className="rounded-[22px] border border-black/10 bg-white/60 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Socials</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{socialLinks.length}</p>
            </div>
          </div>
        </div>

        <div className="hero-card-grid">
          {projects.slice(0, 3).map((project) => (
            <article key={project.id}>
              <span>{project.category}</span>
              <strong>{project.title}</strong>
              <p>{project.description.slice(0, 100)}...</p>
            </article>
          ))}
        </div>
      </section>

      <section className="preview-strip mt-6">
        <div>
          <span className="eyebrow">Profile</span>
          <h2>{settings.aboutTitle}</h2>
        </div>
        <p>{settings.aboutText}</p>
      </section>

      <section id="about" className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-black/10 bg-white/70 p-7 shadow-[0_24px_60px_rgba(19,34,38,0.08)] backdrop-blur-xl sm:p-10">
          <span className="eyebrow">About me</span>
          <h2 className="mt-5 max-w-[14ch] font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.04em] text-slate-950 sm:text-6xl">
            Design systems with substance, not noise.
          </h2>
          <p className="mt-6 max-w-[62ch] text-base leading-8 text-slate-600 sm:text-lg">
            {settings.aboutText}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[30px] border border-black/10 bg-[#183c43] p-7 text-white shadow-[0_24px_60px_rgba(19,34,38,0.12)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.26em] text-white/60">Approach</p>
            <p className="mt-4 text-lg leading-8 text-white/80">
              I blend editorial art direction, product logic, and practical front-end implementation so the final site still feels intentional after launch.
            </p>
          </div>
          <div className="rounded-[30px] border border-black/10 bg-white/78 p-7 shadow-[0_24px_60px_rgba(19,34,38,0.08)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Presence</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-900/10 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="mt-6 rounded-[30px] border border-black/10 bg-white/72 p-7 shadow-[0_24px_60px_rgba(19,34,38,0.08)] backdrop-blur-xl sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Skills</span>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Capabilities across brand, interface, and implementation.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            The admin panel lets you add, edit, or remove these skills without touching any source files.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="rounded-full border border-slate-900/10 bg-[#f7f1e8] px-5 py-3 text-sm font-semibold text-slate-900"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      <section id="portfolio" className="mt-6 rounded-[30px] border border-black/10 bg-white/72 p-7 shadow-[0_24px_60px_rgba(19,34,38,0.08)] backdrop-blur-xl sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Portfolio</span>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Selected project work.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Each project has its own detail page and can be fully managed from the admin dashboard.
          </p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              category={project.category}
              date={project.projectDate}
              description={project.description}
              href={`/projects/${project.slug}`}
              imageUrl={project.imageUrl}
            />
          ))}
        </div>
      </section>

      <section id="contact" className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[30px] border border-black/10 bg-[#183c43] p-7 text-white shadow-[0_24px_60px_rgba(19,34,38,0.12)] sm:p-10">
          <span className="eyebrow border-white/20 text-white/70">Contact</span>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.04em] text-white sm:text-5xl">
            {settings.contactHeading}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-white/75 sm:text-lg">
            {settings.contactBody}
          </p>
          <div className="mt-8 space-y-4 text-sm text-white/80 sm:text-base">
            <p>{settings.contactEmail}</p>
            <p>{settings.contactPhone}</p>
            <p>{settings.contactLocation}</p>
          </div>
        </div>

        <div className="rounded-[30px] border border-black/10 bg-white/72 p-7 shadow-[0_24px_60px_rgba(19,34,38,0.08)] backdrop-blur-xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Contact form</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                Start a project inquiry
              </h3>
            </div>
            {contactSent ? (
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                Message sent
              </span>
            ) : null}
          </div>

          <form action={submitContactAction} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Name
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                  placeholder="Your name"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Project brief
              <textarea
                name="message"
                required
                rows={6}
                className="w-full rounded-[24px] border border-slate-900/10 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                placeholder="Tell me about the project, timeline, and goals."
              />
            </label>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-[#d46f4d]"
            >
              Send message
            </button>
          </form>
        </div>
      </section>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-black/10 bg-white/65 px-5 py-5 text-sm text-slate-600 shadow-[0_18px_45px_rgba(19,34,38,0.08)] backdrop-blur-xl">
        <p>{settings.siteTitle}</p>
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
