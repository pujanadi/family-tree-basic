import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth-context";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  navCollapsed: boolean;
  onToggleDesktopNav: () => void;
  onToggleMobileNav: () => void;
}

const TopBar = ({
  title,
  subtitle,
  actions,
  navCollapsed,
  onToggleDesktopNav,
  onToggleMobileNav
}: TopBarProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/10 bg-slate-950/85 px-4 py-4 backdrop-blur">
      <button
        type="button"
        onClick={onToggleMobileNav}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:border-misty-teal-400 hover:text-misty-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300 lg:hidden"
        aria-label="Open navigation"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 6h16M4 12h16M10 18h10" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onToggleDesktopNav}
        className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:border-misty-teal-400 hover:text-misty-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300 lg:inline-flex"
        aria-label={navCollapsed ? "Expand navigation" : "Collapse navigation"}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          {navCollapsed ? (
            <path d="M10 6 16 12l-6 6" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M14 6 8 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1">
          <h1 className="truncate text-lg font-semibold text-white lg:text-xl">{title}</h1>
          {subtitle && <p className="truncate text-sm text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="hidden w-full max-w-xs items-center md:flex">
        <label htmlFor="backoffice-search" className="sr-only">
          Search the backoffice
        </label>
        <div className="relative w-full">
          <input
            id="backoffice-search"
            type="search"
            placeholder="Search trees, users, exports…"
            className="w-full rounded-2xl border border-white/10 bg-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-misty-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-2-2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {actions}

      <div className="relative">
        <span
          className={cn(
            "inline-flex h-10 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300"
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-misty-teal-500/20 text-sm font-semibold uppercase text-misty-teal-200">
            {user?.initials ?? "AD"}
          </span>
          <span className="hidden flex-col text-left md:flex">
            <span className="text-xs uppercase tracking-wide text-slate-400">Admin</span>
            <span className="text-sm font-semibold text-white">{user?.name ?? "Backoffice"}</span>
          </span>
        </span>
        <button
          type="button"
          onClick={logout}
          className="ml-3 inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-misty-teal-300 hover:text-misty-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

export default TopBar;
