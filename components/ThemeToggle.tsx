import { useMemo } from "react";
import { useTheme } from "next-themes";

const THEMES = ["light", "dark", "sepia"] as const;

const ThemeToggle = () => {
  const { resolvedTheme, theme, setTheme } = useTheme();

  const activeTheme = resolvedTheme ?? theme ?? "light";

  const label = useMemo(() => {
    switch (activeTheme) {
      case "dark":
        return "Dark";
      case "sepia":
        return "Sepia";
      default:
        return "Light";
    }
  }, [activeTheme]);

  const iconPath = useMemo(() => {
    switch (activeTheme) {
      case "dark":
        return "M21 12a9 9 0 1 1-9-9 7 7 0 0 0 9 9z";
      case "sepia":
        return "M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10z";
      default:
        return "M12 3.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V4a.75.75 0 0 1 .75-.75zm0 13a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V17a.75.75 0 0 1 .75-.75zm8-4.25a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5H20zM5.5 12a.75.75 0 0 1-.75.75H3.25a.75.75 0 0 1 0-1.5H4.75A.75.75 0 0 1 5.5 12zm10.95 5.303a.75.75 0 1 1-1.06 1.06l-1.062-1.062a.75.75 0 1 1 1.06-1.06l1.062 1.062zM8.61 8.61a.75.75 0 0 1-1.06 1.06L6.49 8.61a.75.75 0 0 1 1.06-1.06l1.06 1.06zm7.688-2.12a.75.75 0 0 1 1.06 1.06L16.294 8.61a.75.75 0 1 1-1.06-1.06l1.062-1.06zM8.61 15.39a.75.75 0 1 1-1.06-1.06l1.06-1.062a.75.75 0 1 1 1.06 1.06L8.61 15.39z";
    }
  }, [activeTheme]);

  const handleToggle = () => {
    const currentIndex = THEMES.indexOf(activeTheme as (typeof THEMES)[number]);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-misty-teal-300 hover:text-misty-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
      aria-label={`Toggle theme, current theme ${label}`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d={iconPath} fill="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default ThemeToggle;
