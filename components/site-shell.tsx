import Link from "next/link";

import { site } from "@/lib/site";

export function SiteShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="shell">
      <header className="site-header">
        <Link className="wordmark" href="/">
          {site.name}
        </Link>
        <p className="tagline">{site.tagline}</p>
        <nav aria-label="Primary">
          <Link href="/">Home</Link>
        </nav>
      </header>
      <main>
        {title ? <h1 className="page-title">{title}</h1> : null}
        {children}
      </main>
      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
      </footer>
    </div>
  );
}
