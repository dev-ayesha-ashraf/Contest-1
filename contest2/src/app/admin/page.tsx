import Image from "next/image";
import Link from "next/link";

import { formatProjectDate } from "@/lib/formatters";
import { requireAdminSession } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/site";

import {
  createProjectAction,
  createSkillAction,
  createSocialLinkAction,
  deleteProjectAction,
  deleteSkillAction,
  deleteSocialLinkAction,
  logoutAction,
  updateProjectAction,
  updateSiteSettingsAction,
  updateSkillAction,
  updateSocialLinkAction,
} from "./actions";

type AdminPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

const panelClass =
  "rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_60px_rgba(8,15,18,0.18)] backdrop-blur-xl sm:p-6";
const fieldClass =
  "w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d46f4d]";
const labelClass = "space-y-2 text-sm font-medium text-slate-300";

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const [session, data, params] = await Promise.all([
    requireAdminSession(),
    getAdminDashboardData(),
    searchParams,
  ]);

  const notice = params.status
    ? {
        type: "success",
        message: params.status.replace(/-/g, " "),
      }
    : params.error
      ? {
          type: "error",
          message: params.error.replace(/-/g, " "),
        }
      : null;

  return (
    <main className="min-h-screen bg-[#081012] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(24,60,67,0.96),rgba(10,18,20,0.94))] px-6 py-5 shadow-[0_24px_60px_rgba(8,15,18,0.28)]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Admin panel</p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.04em] sm:text-5xl">
              Portfolio content management
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Signed in as {session.name ?? session.email}. Manage projects, profile content, skills, social links, and contact information from this dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
            >
              View site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-full bg-[#d46f4d] px-5 text-sm font-semibold text-white transition hover:bg-[#ef8a68]"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        {notice ? (
          <div
            className={`rounded-[20px] border px-4 py-3 text-sm font-medium ${
              notice.type === "success"
                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                : "border-rose-400/25 bg-rose-400/10 text-rose-200"
            }`}
          >
            {notice.message}
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className={panelClass}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Site content</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">Homepage, about, and contact</h2>
              </div>
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/45">
                Settings
              </span>
            </div>

            <form action={updateSiteSettingsAction} className="mt-8 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  Site title
                  <input name="siteTitle" defaultValue={data.settings.siteTitle} className={fieldClass} />
                </label>
                <label className={labelClass}>
                  Site subtitle
                  <input name="siteSubtitle" defaultValue={data.settings.siteSubtitle} className={fieldClass} />
                </label>
              </div>

              <label className={labelClass}>
                Intro heading
                <textarea name="introTitle" rows={3} defaultValue={data.settings.introTitle} className={fieldClass} />
              </label>

              <label className={labelClass}>
                Intro text
                <textarea name="introText" rows={4} defaultValue={data.settings.introText} className={fieldClass} />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  About title
                  <input name="aboutTitle" defaultValue={data.settings.aboutTitle} className={fieldClass} />
                </label>
                <label className={labelClass}>
                  Contact heading
                  <input name="contactHeading" defaultValue={data.settings.contactHeading} className={fieldClass} />
                </label>
              </div>

              <label className={labelClass}>
                About text
                <textarea name="aboutText" rows={5} defaultValue={data.settings.aboutText} className={fieldClass} />
              </label>

              <label className={labelClass}>
                Contact body
                <textarea name="contactBody" rows={4} defaultValue={data.settings.contactBody} className={fieldClass} />
              </label>

              <div className="grid gap-5 md:grid-cols-3">
                <label className={labelClass}>
                  Contact email
                  <input name="contactEmail" type="email" defaultValue={data.settings.contactEmail} className={fieldClass} />
                </label>
                <label className={labelClass}>
                  Contact phone
                  <input name="contactPhone" defaultValue={data.settings.contactPhone} className={fieldClass} />
                </label>
                <label className={labelClass}>
                  Contact location
                  <input name="contactLocation" defaultValue={data.settings.contactLocation} className={fieldClass} />
                </label>
              </div>

              <button
                type="submit"
                className="inline-flex min-h-12 w-fit items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-[#d46f4d] hover:text-white"
              >
                Save site settings
              </button>
            </form>
          </div>

          <div className="grid gap-6">
            <div className={panelClass}>
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Recent contact messages</p>
              <div className="mt-6 space-y-4">
                {data.submissions.length === 0 ? (
                  <p className="text-sm leading-7 text-white/55">No contact submissions yet.</p>
                ) : (
                  data.submissions.map((submission) => (
                    <article key={submission.id} className="rounded-[22px] border border-white/10 bg-slate-950/35 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{submission.name}</p>
                          <p className="text-sm text-white/55">{submission.email}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.22em] text-white/35">
                          {formatProjectDate(submission.createdAt)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white/70">{submission.message}</p>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className={panelClass}>
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Publishing notes</p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-white/65">
                <p>Project images are stored locally in the uploads directory, which is suitable for Node-based hosting or a VPS.</p>
                <p>For production, change the admin credentials in the environment file and reseed the database.</p>
                <p>Every save revalidates the public pages so content updates appear immediately.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className={panelClass}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Skills</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">Manage skills list</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {data.skills.map((skill) => (
                <form key={skill.id} action={updateSkillAction} className="rounded-[22px] border border-white/10 bg-slate-950/35 p-4">
                  <input type="hidden" name="id" value={skill.id} />
                  <div className="grid gap-4 md:grid-cols-[1fr_120px_auto_auto]">
                    <input name="name" defaultValue={skill.name} className={fieldClass} />
                    <input name="sortOrder" type="number" defaultValue={skill.sortOrder} className={fieldClass} />
                    <button type="submit" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950">
                      Update
                    </button>
                    <button formAction={deleteSkillAction} className="rounded-full border border-rose-400/30 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-400 hover:text-white">
                      Delete
                    </button>
                  </div>
                </form>
              ))}
            </div>

            <form action={createSkillAction} className="mt-6 grid gap-4 rounded-[22px] border border-dashed border-white/12 bg-slate-950/25 p-4 md:grid-cols-[1fr_120px_auto]">
              <input name="name" placeholder="Add a skill" className={fieldClass} />
              <input name="sortOrder" type="number" placeholder="Order" className={fieldClass} />
              <button type="submit" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#d46f4d] hover:text-white">
                Add skill
              </button>
            </form>
          </div>

          <div className={panelClass}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Social links</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">Manage social profiles</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {data.socialLinks.map((link) => (
                <form key={link.id} action={updateSocialLinkAction} className="rounded-[22px] border border-white/10 bg-slate-950/35 p-4">
                  <input type="hidden" name="id" value={link.id} />
                  <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr_120px_auto_auto]">
                    <input name="label" defaultValue={link.label} className={fieldClass} />
                    <input name="url" defaultValue={link.url} className={fieldClass} />
                    <input name="sortOrder" type="number" defaultValue={link.sortOrder} className={fieldClass} />
                    <button type="submit" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950">
                      Update
                    </button>
                    <button formAction={deleteSocialLinkAction} className="rounded-full border border-rose-400/30 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-400 hover:text-white">
                      Delete
                    </button>
                  </div>
                </form>
              ))}
            </div>

            <form action={createSocialLinkAction} className="mt-6 grid gap-4 rounded-[22px] border border-dashed border-white/12 bg-slate-950/25 p-4 md:grid-cols-[0.75fr_1.25fr_120px_auto]">
              <input name="label" placeholder="Label" className={fieldClass} />
              <input name="url" placeholder="https://example.com" className={fieldClass} />
              <input name="sortOrder" type="number" placeholder="Order" className={fieldClass} />
              <button type="submit" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#d46f4d] hover:text-white">
                Add link
              </button>
            </form>
          </div>
        </section>

        <section className={panelClass}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Projects</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Portfolio project management</h2>
            </div>
            <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/45">
              CRUD + uploads
            </span>
          </div>

          <form action={createProjectAction} className="mt-8 grid gap-5 rounded-[26px] border border-dashed border-white/12 bg-slate-950/25 p-5">
            <h3 className="text-lg font-semibold text-white">Add new project</h3>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <label className={labelClass}>
                Title
                <input name="title" required className={fieldClass} />
              </label>
              <label className={labelClass}>
                Category
                <input name="category" required className={fieldClass} />
              </label>
              <label className={labelClass}>
                Project date
                <input name="projectDate" type="date" required className={fieldClass} />
              </label>
              <label className={labelClass}>
                Project link
                <input name="projectLink" type="url" required className={fieldClass} />
              </label>
            </div>
            <label className={labelClass}>
              Description
              <textarea name="description" rows={5} required className={fieldClass} />
            </label>
            <label className={labelClass}>
              Project image
              <input name="image" type="file" accept="image/*" className={fieldClass} />
            </label>
            <button type="submit" className="inline-flex min-h-12 w-fit items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-[#d46f4d] hover:text-white">
              Create project
            </button>
          </form>

          <div className="mt-8 grid gap-6">
            {data.projects.map((project) => (
              <article key={project.id} className="overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/35">
                <div className="grid gap-0 xl:grid-cols-[0.36fr_0.64fr]">
                  <div className="relative min-h-[220px] border-b border-white/10 bg-[linear-gradient(135deg,rgba(24,60,67,0.94),rgba(212,111,77,0.62))] xl:min-h-full xl:border-b-0 xl:border-r">
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full flex-col justify-between p-6 text-[#f7f1e8]">
                        <span className="text-xs uppercase tracking-[0.28em] text-white/70">{project.category}</span>
                        <div>
                          <p className="text-3xl font-semibold leading-tight">{project.title}</p>
                          <p className="mt-3 text-sm text-white/70">{formatProjectDate(project.projectDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <form action={updateProjectAction} className="grid gap-5 p-5 sm:p-6">
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="existingImageUrl" value={project.imageUrl ?? ""} />

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                      <label className={labelClass}>
                        Title
                        <input name="title" required defaultValue={project.title} className={fieldClass} />
                      </label>
                      <label className={labelClass}>
                        Category
                        <input name="category" required defaultValue={project.category} className={fieldClass} />
                      </label>
                      <label className={labelClass}>
                        Project date
                        <input
                          name="projectDate"
                          type="date"
                          required
                          defaultValue={project.projectDate.toISOString().slice(0, 10)}
                          className={fieldClass}
                        />
                      </label>
                      <label className={labelClass}>
                        Project link
                        <input name="projectLink" type="url" required defaultValue={project.projectLink} className={fieldClass} />
                      </label>
                    </div>

                    <label className={labelClass}>
                      Description
                      <textarea name="description" rows={5} required defaultValue={project.description} className={fieldClass} />
                    </label>

                    <div className="grid gap-5 md:grid-cols-[1fr_auto_auto] md:items-end">
                      <label className={labelClass}>
                        Replace image
                        <input name="image" type="file" accept="image/*" className={fieldClass} />
                      </label>
                      <label className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white/70">
                        <input name="removeImage" type="checkbox" className="h-4 w-4 accent-[#d46f4d]" />
                        Remove current image
                      </label>
                      <div className="flex flex-wrap gap-3">
                        <button type="submit" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950">
                          Save changes
                        </button>
                        <button formAction={deleteProjectAction} className="rounded-full border border-rose-400/30 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-400 hover:text-white">
                          Delete project
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}