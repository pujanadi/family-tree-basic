import { forwardRef, memo } from "react";
import type { FamilyNodeDatum } from "@/lib/tree-utils";

interface PersonNodeProps {
  node: FamilyNodeDatum;
  isSelected: boolean;
  isHighlighted: boolean;
  isCollapsed: boolean;
  onToggle?: (id: string) => void;
  onSelect?: (id: string) => void;
}

function formatLifeSpan(birth?: number | null, death?: number | null) {
  if (!birth && !death) {
    return null;
  }
  if (!birth) {
    return `d. ${death}`;
  }
  if (!death) {
    return `${birth} \u2013`;
  }
  return `${birth} \u2013 ${death}`;
}

const BasePersonNode = forwardRef<HTMLDivElement, PersonNodeProps>(({
  node,
  isSelected,
  isHighlighted,
  isCollapsed,
  onToggle,
  onSelect
}, ref) => {
  const primary = node.person;

  const handleToggle = () => {
    onToggle?.(primary.id);
  };

  const handleSelect = () => {
    onSelect?.(primary.id);
  };

  const lifeSpan = formatLifeSpan(primary.birthYear ?? undefined, primary.deathYear ?? undefined);

  return (
    <div
      ref={ref}
      className={[
        "min-w-[220px] rounded-xl border backdrop-blur bg-white/80 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 shadow-ambient transition-transform",
        isSelected ? "ring-2 ring-misty-teal-400 dark:ring-misty-teal-300 scale-[1.02]" : "",
        isHighlighted && !isSelected ? "outline outline-2 outline-offset-2 outline-misty-teal-300" : ""
      ].join(" ")}
      role="treeitem"
      aria-expanded={node.hasChildren ? !isCollapsed : undefined}
      data-node-id={primary.id}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-misty-teal-100 text-misty-teal-700 dark:bg-misty-teal-900/60 dark:text-misty-teal-200 font-semibold">
          {primary.name[0]}
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            <button
              type="button"
              onClick={handleSelect}
              className="text-left text-base font-semibold text-slate-800 dark:text-slate-100 hover:text-misty-teal-600 dark:hover:text-misty-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300 rounded"
            >
              {primary.name}
            </button>
            {node.hasChildren && (
              <button
                type="button"
                onClick={handleToggle}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300"
                aria-label={isCollapsed ? "Expand branch" : "Collapse branch"}
              >
                {isCollapsed ? "+" : "\u2212"}
              </button>
            )}
          </div>
          {lifeSpan && <p className="text-sm text-slate-500 dark:text-slate-400">{lifeSpan}</p>}
        </div>
      </div>
      {node.spouses.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-700/70 px-4 py-3 bg-gradient-to-r from-misty-teal-50/80 to-transparent dark:from-slate-900/60">
          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">Spouse</p>
          <div className="flex flex-wrap gap-3">
            {node.spouses.map((spouse) => (
              <div key={spouse.id} className="flex items-center gap-2 rounded-lg border border-transparent bg-white/80 px-3 py-2 text-sm text-slate-600 dark:bg-slate-900/70 dark:text-slate-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-sand-200 text-soft-sand-700 dark:bg-slate-800 dark:text-slate-300 font-semibold">
                  {spouse.name[0]}
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="font-medium">{spouse.name}</span>
                  {formatLifeSpan(spouse.birthYear ?? undefined, spouse.deathYear ?? undefined) && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {formatLifeSpan(spouse.birthYear ?? undefined, spouse.deathYear ?? undefined)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

BasePersonNode.displayName = "PersonNode";

const PersonNode = memo(BasePersonNode);

export { PersonNode };
export default PersonNode;
