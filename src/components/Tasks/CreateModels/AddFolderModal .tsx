import { useEffect } from "react";
import { X, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateFolder } from "@/hooks/Tasks/CreateModels/useCreateFolder";

export const AddFolderModal = ({
  isOpen,
  onClose,
  workspaceId,
  refetchTree,
}) => {
  const { name, setName, submit, isLoading, reset } = useCreateFolder({
    workspaceId,
    onClose,
    refetchTree,
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    await submit();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-lg">
        <div className="max-h-[88vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:rounded-[32px]">
          {/* HEADER */}
          <div className="p-5 border-b border-slate-200/70">
            <div className="mb-2 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
              <FolderPlus className="me-1 h-3 w-3" />
              New Folder
            </div>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Create Folder
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Organize tasks inside workspace
            </p>

            <button
              onClick={onClose}
              className="absolute right-5 top-5 h-10 w-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs text-slate-500">Folder name</label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. UI Tasks"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 p-5 border-t border-slate-200/70">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 w-full rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="h-12 w-full rounded-2xl bg-blue-600 px-6 font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.24)] hover:bg-blue-700 sm:w-auto"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
