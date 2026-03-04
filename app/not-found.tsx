import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-colors">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
          Error 404
        </p>
        <h1 className="mt-3 font-display text-5xl font-black uppercase tracking-tighter md:text-6xl">
          Page Not Found
        </h1>
        <p className="mt-4 max-w-xl text-black/60 dark:text-white/60">
          The page you requested does not exist or may have been moved.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/"
            className="bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-accent/90"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="border-2 border-black/10 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all hover:border-accent dark:border-white/10"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
