import type { Person } from "@/lib/types";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import ExportButton from "./ExportButton";
import LoginButton from "./LoginButton";

interface ToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  results: Person[];
  onSelectResult: (id: string) => void;
  onExport: () => Promise<void>;
  onResetView: () => void;
}

const Toolbar = ({
  query,
  onQueryChange,
  results,
  onSelectResult,
  onExport,
  onResetView
}: ToolbarProps) => (
  <header className="flex w-full flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-ambient backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80">
    <div className="flex flex-1 flex-wrap items-center gap-4">
      <div className="min-w-[240px] flex-1">
        <SearchBar query={query} onQueryChange={onQueryChange} results={results} onSelect={onSelectResult} />
      </div>
      <button
        type="button"
        onClick={onResetView}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-misty-teal-300 hover:text-misty-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300 dark:border-slate-700 dark:text-slate-200"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 5V3l-4 4 4 4V9a5 5 0 0 1 5 5 5 5 0 0 1-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Reset view
      </button>
    </div>
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <ExportButton onExport={onExport} />
      <LoginButton />
    </div>
  </header>
);

export default Toolbar;
