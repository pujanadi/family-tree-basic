import { useEffect, useId, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Person } from "@/lib/types";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  results: Person[];
  onSelect: (id: string) => void;
}

const SearchBar = ({ query, onQueryChange, results, onSelect }: SearchBarProps) => {
  const listboxId = useId();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [results, query]);

  const hasResults = results.length > 0;
  const activeId = useMemo(
    () => (hasResults ? `${listboxId}-option-${results[activeIndex]?.id}` : undefined),
    [activeIndex, hasResults, listboxId, results]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!hasResults) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = results[activeIndex];
      if (item) {
        onSelect(item.id);
      }
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="tree-search" className="sr-only">
        Search family members
      </label>
      <div className="relative flex items-center">
        <svg
          className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-2-2" strokeLinecap="round" />
        </svg>
        <input
          id="tree-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          placeholder="Search by name..."
          className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm shadow-sm focus:border-misty-teal-300 focus:outline-none focus:ring-2 focus:ring-misty-teal-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
          role="combobox"
          aria-expanded={hasResults}
          aria-controls={hasResults ? listboxId : undefined}
          aria-activedescendant={activeId}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {hasResults ? `${results.length} search results` : "No results"}
      </p>
      {hasResults && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900/90"
        >
          {results.map((person, index) => {
            const lifespan = [person.birthYear, person.deathYear].filter(Boolean).join(" \u2013 ");
            const isActive = index === activeIndex;
            return (
              <li key={person.id} id={`${listboxId}-option-${person.id}`} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => onSelect(person.id)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition ${
                    isActive
                      ? "bg-misty-teal-50 text-misty-teal-700 dark:bg-slate-800/80 dark:text-misty-teal-200"
                      : "text-slate-600 hover:bg-soft-sand-100 dark:text-slate-200 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span>{person.name}</span>
                  {lifespan && <span className="text-xs text-slate-400 dark:text-slate-500">{lifespan}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
