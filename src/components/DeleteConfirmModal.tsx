import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteConfirmModal = ({
  isOpen,
  title = "Delete item",
  description = "This action cannot be undone.",
  loading = false,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
      <button
        className="absolute inset-0"
        onClick={onClose}
        type="button"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Footer */}
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
            disabled={loading}
            className="flex h-11 items-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
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