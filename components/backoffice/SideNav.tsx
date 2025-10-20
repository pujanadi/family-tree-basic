import Link from "next/link";
import { useMemo } from "react";
import { cn } from "@/lib/cn";

export interface IconProps {
  className?: string;
}

export interface BackofficeNavItem {
  label: string;
  href: string;
  icon: (props: IconProps) => JSX.Element;
  comingSoon?: boolean;
}

interface SideNavProps {
  items: BackofficeNavItem[];
  collapsed: boolean;
  mobileOpen: boolean;
  currentPath: string;
  onCloseMobile: () => void;
}

const SideNav = ({ items, collapsed, mobileOpen, currentPath, onCloseMobile }: SideNavProps) => {
  const groupedItems = useMemo(() => items, [items]);

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-white/10 bg-slate-950/95 backdrop-blur transition-transform duration-300 ease-out lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-misty-teal-500/20 text-misty-teal-300">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 11.5 12 4l8 7.5v8.5H4z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 18.5v-4h5v4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Backoffice</span>
              <span className="text-base font-semibold text-white">Family Atlas</span>
            </div>
          )}
        </div>

        <nav
          aria-label="Backoffice navigation"
          className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4"
          role="navigation"
        >
          {groupedItems.map((item) => {
            const isActive =
              currentPath === item.href ||
              (item.href !== "/backoffice" && currentPath.startsWith(item.href) && currentPath !== "/backoffice/login");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-misty-teal-500/15 text-misty-teal-200 shadow-inner shadow-misty-teal-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition",
                    isActive ? "text-misty-teal-200" : "text-slate-500 group-hover:text-slate-200"
                  )}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">
                    {item.label}
                    {item.comingSoon && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                        Soon
                      </span>
                    )}
                  </span>
                )}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 hidden rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg lg:group-hover:block">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4 text-xs text-slate-500">
          {!collapsed ? (
            <p>Version 0.1.0</p>
          ) : (
            <span className="block text-center text-[10px] uppercase tracking-wide text-slate-500">v0.1</span>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideNav;
