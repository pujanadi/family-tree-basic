import React, { useEffect, useState } from "react";
import { Person } from "@/lib/types";

interface MemberFormProps {
  person?: Person | null;
  onCancel?: () => void;
  onSave?: (p: Person) => void;
  saving?: boolean;
}

const emptyPerson = (): Person => ({ id: `${Date.now()}`, name: "", birthYear: undefined, deathYear: undefined, spouseIds: [], childIds: [] });

const MemberForm = ({ person, onCancel, onSave, saving }: MemberFormProps) => {
  const [draft, setDraft] = useState<Person>(person ?? emptyPerson());

  useEffect(() => setDraft(person ?? emptyPerson()), [person]);

  const update = (patch: Partial<Person>) => setDraft((d) => ({ ...d, ...patch }));

  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    // Basic validation
    if (!draft.name || draft.name.trim() === "") {
      setError("Name is required");
      return;
    }
    setError(null);
    onSave?.(draft);
  };

  return (
    <div className="rounded-2xl border border-white/6 bg-white/2 p-6">
      <div className="space-y-3">
        <label className="block text-xs text-slate-300">Full name</label>
        <input
          value={draft.name}
          onChange={(e) => update({ name: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-white"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-300">Birth year</label>
            <input
              type="number"
              value={draft.birthYear ?? ""}
              onChange={(e) => update({ birthYear: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300">Death year</label>
            <input
              type="number"
              value={draft.deathYear ?? ""}
              onChange={(e) => update({ deathYear: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-white"
            />
          </div>
        </div>

        {error && <div className="text-sm text-rose-400">{error}</div>}

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-misty-teal-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={saving}
          >
            {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
            <span>Save</span>
          </button>
          <button onClick={onCancel} className="rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-300">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
