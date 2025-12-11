import React, { useState } from "react";

interface AttachModalProps {
  open: boolean;
  mode: "child" | "spouse" | "parent";
  sourceId?: string;
  onClose?: () => void;
  onConfirm?: (opts: { targetId: string; mode: string }) => void;
}

const AttachModal = ({ open, mode, sourceId, onClose, onConfirm, loading, error }: AttachModalProps & { loading?: boolean; error?: string | null }) => {
  const [targetId, setTargetId] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 p-6">
        <h3 className="text-lg font-semibold text-white">Attach as {mode}</h3>
        <p className="mt-2 text-sm text-slate-400">Choose an existing person to attach or paste an ID to link.</p>

          <div className="mt-4">
            <label className="block text-xs text-slate-300">Person ID</label>
            <input value={targetId} onChange={(e) => setTargetId(e.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" />
          </div>

          {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}

          <div className="mt-6 flex justify-end gap-2">
            <button onClick={onClose} className="rounded-md bg-white/5 px-4 py-2 text-sm text-slate-300">Cancel</button>
            <button
              onClick={() => onConfirm?.({ targetId, mode })}
              className="inline-flex items-center gap-2 rounded-md bg-misty-teal-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              disabled={loading}
            >
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              <span>Attach</span>
            </button>
          </div>
      </div>
    </div>
  );
};

export default AttachModal;
