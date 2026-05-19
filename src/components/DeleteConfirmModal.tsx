import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const normalize = (v = "") => v.trim().toLowerCase();

const DeleteConfirmModal = ({
  isOpen,
  title = "Delete item",
  description = "This action cannot be undone.",
  stateName = "",
  loading = false,
  onClose,
  onConfirm,
}) => {
  const [input, setInput] = useState("");

  // reset when open/close
  useEffect(() => {
    if (!isOpen) setInput("");
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatch = normalize(input) === normalize(stateName);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
      <button className="absolute inset-0" onClick={onClose} type="button" />

      <div className="relative w-[35em]  overflow-hidden rounded-3xl bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
        {/* HEADER */}
        <div className="relative p-5 border-b border-slate-200/70 bg-slate-100">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
            <AlertTriangle className="h-4 w-4" />
            Destructive action
          </div>

          {/* TITLE */}
          <h3 className="mt-3 text-lg font-bold text-slate-900">{title}</h3>

          {/* DESCRIPTION */}
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">
            {description}
          </p>

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 pt-5 space-y-3">
          <label className="text-xs text-slate-500">
            Type{" "}
            <span className="font-semibold text-slate-800">{stateName}</span> to
            confirm
          </label>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type name exactly..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
          />

          {/* helper hint */}
          {!isMatch && input.length > 0 && (
            <p className="text-xs text-red-500">Name does not match</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={!isMatch || loading}
            className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition
              ${
                isMatch
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-300 cursor-not-allowed"
              }
            `}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
