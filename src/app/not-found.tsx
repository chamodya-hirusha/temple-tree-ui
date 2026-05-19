import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground animate-pulse">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground hover:bg-brand-dark transition shadow-glow"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
