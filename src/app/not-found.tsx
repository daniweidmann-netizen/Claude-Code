import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-neutral-500">Diese Seite konnte nicht gefunden werden.</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
