import { Link, Outlet } from "@tanstack/react-router";

const navigationItems = [
  { label: "Habitats", to: "/habitats" },
  { label: "Species", to: "/species" },
  { label: "Go Birding", to: "/go-birding" },
] as const;

export default function ExplorerShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/habitats"
            className="text-lg font-bold tracking-wide text-emerald-300"
          >
            Birdman Explorer
          </Link>
          <nav aria-label="Explorer navigation" className="flex gap-6">
            {navigationItems.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: false }}
                className="text-sm text-slate-300 transition hover:text-white"
                activeProps={{ className: "text-sm text-emerald-300" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 px-6 py-5 text-center text-sm text-slate-500">
        Discover the birds and habitats around you.
      </footer>
    </div>
  );
}
