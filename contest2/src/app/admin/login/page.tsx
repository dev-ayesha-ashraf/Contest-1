import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";

import { loginAction } from "../actions";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const [session, params] = await Promise.all([getAdminSession(), searchParams]);

  if (session) {
    redirect("/admin");
  }

  const showError = params.error === "invalid" || params.error === "missing";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f9f3e8_0%,#efe5d4_100%)] px-4 py-8 text-slate-950 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[34px] border border-black/10 bg-[#183c43] p-8 text-white shadow-[0_24px_60px_rgba(19,34,38,0.12)] sm:p-10">
          <span className="eyebrow border-white/20 text-white/70">Admin access</span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl leading-none tracking-[-0.04em] sm:text-6xl">
            Manage the portfolio without touching code.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
            Sign in to add, edit, and remove portfolio projects, upload images, update your about section, manage skills, social links, and contact information.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/80">
            <span className="rounded-full border border-white/15 px-4 py-2">Secure session cookie</span>
            <span className="rounded-full border border-white/15 px-4 py-2">SQLite + Prisma</span>
            <span className="rounded-full border border-white/15 px-4 py-2">Editable project detail pages</span>
          </div>
        </section>

        <section className="rounded-[34px] border border-black/10 bg-white/78 p-8 shadow-[0_24px_60px_rgba(19,34,38,0.08)] backdrop-blur-xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Login</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                Admin dashboard sign in
              </h2>
            </div>
            <Link
              href="/"
              className="rounded-full border border-slate-900/10 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              View site
            </Link>
          </div>

          {showError ? (
            <div className="mt-6 rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              Enter a valid admin email and password.
            </div>
          ) : null}

          <form action={loginAction} className="mt-8 space-y-5">
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Email
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                placeholder="admin@portfolio.local"
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Password
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                placeholder="Enter your password"
              />
            </label>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-[#d46f4d]"
            >
              Sign in
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}