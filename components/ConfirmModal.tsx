import React from "react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const ConfirmModal = ({ open, title = "Confirm", message = "Are you sure?", onCancel, onConfirm }: ConfirmModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{message}</p>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-md bg-white/5 px-4 py-2 text-sm text-slate-300">Cancel</button>
          <button onClick={onConfirm} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
