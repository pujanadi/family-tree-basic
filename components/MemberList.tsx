import React from "react";
import { Person } from "@/lib/types";

interface MemberListProps {
  people: Person[];
  onSelect?: (p: Person) => void;
  onEdit?: (p: Person) => void;
  onDelete?: (p: Person) => void;
  loading?: boolean;
  actionDisabled?: boolean;
}

const MemberList = ({ people, onSelect, onEdit, onDelete, loading, actionDisabled }: MemberListProps) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/6 bg-white/2 p-4">
        <ul className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-md px-3 py-2 opacity-60">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-slate-700" />
                <div className="min-w-0">
                  <div className="h-3 w-40 animate-pulse rounded bg-slate-700" />
                  <div className="mt-2 h-2 w-24 animate-pulse rounded bg-slate-700" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/6 bg-white/2 p-4">
      <ul className="space-y-2">
        {people.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-white/3">
            <button type="button" className="flex-1 text-left" onClick={() => onSelect?.(p)}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-misty-teal-500/10 text-misty-teal-200">
                  {p.name ? p.name.split(" ").map((s) => s[0]).slice(0,2).join("") : "?"}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{p.name}</div>
                  <div className="truncate text-xs text-slate-400">{p.birthYear ?? ""}{p.deathYear ? ` - ${p.deathYear}` : ""}</div>
                </div>
              </div>
            </button>

            <div className="ml-3 flex items-center gap-2">
              <button
                type="button"
                aria-label={`Edit ${p.name}`}
                onClick={() => onEdit?.(p)}
                className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-200"
                disabled={actionDisabled}
              >
                Edit
              </button>
              <button
                type="button"
                aria-label={`Delete ${p.name}`}
                onClick={() => onDelete?.(p)}
                className="rounded-md bg-red-600/20 px-2 py-1 text-xs text-red-200 disabled:opacity-50"
                disabled={actionDisabled}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
