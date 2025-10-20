import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import SideNav, { type BackofficeNavItem } from "./SideNav";
import TopBar from "./TopBar";
import { useAuth } from "@/lib/auth-context";

interface BackofficeLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

const NAV_STORAGE_KEY = "family-tree.backoffice.navCollapsed";

const navItems: BackofficeNavItem[] = [
  {
    label: "Overview",
    href: "/backoffice",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
        <path d="M4 13.5V20a1 1 0 0 0 1 1h4.5v-5.5H4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 10.5H9.5V21H19a1 1 0 0 0 1-1v-6.5h-5.5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.5 3.5h-7v7h7v-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    label: "Family Trees",
    href: "/backoffice/trees",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
        <path d="M12 5.5V21" strokeLinecap="round" />
        <path d="M7 12h10" strokeLinecap="round" />
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="5.5" cy="12" r="2.5" />
        <circle cx="18.5" cy="12" r="2.5" />
        <circle cx="12" cy="20" r="2.5" />
      </svg>
    )
  },
  {
    label: "Exports",
    href: "/backoffice/exports",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
        <path d="M12 3v13" strokeLinecap="round" />
        <path d="M16 11l-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 17h14" strokeLinecap="round" />
      </svg>
    )
  },
  {
    label: "Users",
    href: "/backoffice/users",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
        <circle cx="9" cy="7.5" r="2.5" />
        <path d="M3.5 18.5a4.5 4.5 0 0 1 9 0" strokeLinecap="round" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M14 18.5a4.5 4.5 0 0 1 6 0" strokeLinecap="round" />
      </svg>
    )
  },
  {
    label: "Audit Log",
    href: "/backoffice/audit",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
        <path d="M5.5 4.5h13" strokeLinecap="round" />
        <path d="M5.5 9.5H13" strokeLinecap="round" />
        <path d="M5.5 14.5h9" strokeLinecap="round" />
        <path d="M5.5 19.5H11" strokeLinecap="round" />
      </svg>
    )
  },
  {
    label: "Settings",
    href: "/backoffice/settings",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
        <path
          d="M19.5 12a7.5 7.5 0 0 0-.07-.995l2.026-1.58-2-3.464-2.375.714a7.515 7.515 0 0 0-1.72-.996L15 3h-6l-.41 2.68a7.517 7.517 0 0 0-1.72.996l-2.375-.714-2 3.464 2.027 1.58A7.502 7.502 0 0 0 4.5 12c0 .338.023.67.07.995l-2.027 1.58 2 3.465 2.376-.715c.52.41 1.088.748 1.72.996L9 21h6l.41-2.679a7.515 7.515 0 0 0 1.72-.996l2.375.714 2-3.464-2.026-1.58c.046-.326.071-.658.071-.995z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
];

const BackofficeLayout = ({ title, subtitle, actions, children }: BackofficeLayoutProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(NAV_STORAGE_KEY);
    if (stored === "true") {
      setNavCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (!user || user.role !== "admin") {
      const redirectTo = encodeURIComponent(router.asPath);
      void router.replace(`/backoffice/login?redirectTo=${redirectTo}`);
      return;
    }
    setIsReady(true);
  }, [router, user]);

  const toggleCollapsed = useCallback(() => {
    setNavCollapsed((previous) => {
      const next = !previous;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(NAV_STORAGE_KEY, next ? "true" : "false");
      }
      return next;
    });
  }, []);

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  const currentPath = useMemo(() => router.asPath, [router.asPath]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3 text-sm text-slate-400">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-misty-teal-400" />
          Loading backoffice&hellip;
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <SideNav
        items={navItems}
        collapsed={navCollapsed}
        mobileOpen={mobileNavOpen}
        onCloseMobile={closeMobileNav}
        currentPath={currentPath}
      />
      <div className="flex flex-1 flex-col">
        <TopBar
          title={title}
          subtitle={subtitle}
          onToggleDesktopNav={toggleCollapsed}
          onToggleMobileNav={openMobileNav}
          navCollapsed={navCollapsed}
          actions={actions}
        />
        <main className="flex-1 overflow-y-auto bg-slate-950 px-6 pb-12 pt-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default BackofficeLayout;
