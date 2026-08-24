import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useEffect } from "react";

const DeleteConfirmModal = ({
  isOpen,
  title = "Delete item",
  description = "This action cannot be undone.",
  loading = false,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (!isOpen) {
      // Optional cleanup when modal closes
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
      {/* BACKDROP */}
      <button
        className="absolute inset-0"
        onClick={onClose}
        type="button"
        aria-label="Close modal"
      />

      {/* MODAL */}
      <div className="relative w-full max-w-[35rem] overflow-hidden rounded-3xl bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
        {/* HEADER */}
        <div className="relative border-b border-slate-200/70 bg-slate-100 p-5">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
            <AlertTriangle className="h-4 w-4" />
            Destructive action
          </div>

          {/* TITLE */}
          <h3 className="mt-3 text-lg font-bold text-slate-900">
            {title}
          </h3>

          {/* DESCRIPTION */}
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {description}
          </p>

          {/* CLOSE */}
          <button
            onClick={onClose}
            disabled={loading}
            type="button"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 pt-6">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Are you sure you want to delete this item?
                </p>

                <p className="mt-1 text-xs leading-relaxed text-red-600/80">
                  This action cannot be undone. The selected item will be
                  permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-5">
          <button
            onClick={onClose}
            disabled={loading}
            type="button"
            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            type="button"
            className="flex h-11 items-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}

            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;