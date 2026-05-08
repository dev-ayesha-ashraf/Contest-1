import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f9f3e8_0%,#efe5d4_100%)] px-4 py-10 text-slate-950 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 rounded-[32px] border border-black/10 bg-white/72 p-8 shadow-[0_24px_60px_rgba(19,34,38,0.08)] backdrop-blur-xl sm:p-12">
        <span className="eyebrow">404</span>
        <h1 className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-[-0.04em] sm:text-6xl">
          Project not found.
        </h1>
        <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
          The requested page does not exist or may have been removed from the portfolio.
        </p>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-[#d46f4d]"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}