import { X } from "lucide-react";
import {
  formatFileSize,
  getFileIcon,
  getFileCategoryFromMime,
} from "@/utils/attachment.helper.ts";

const PendingAttachmentList = ({ files = [], onRemove, disabled = false }) => {
  if (!files.length) return null;

  return (
    <div className="grid gap-2">
      {files.map((file, index) => {
        const category = getFileCategoryFromMime(file.type);
        const Icon = getFileIcon(category);
        return (
          <div
            key={`${file.name}-${index}`}
            className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {file.name}
              </p>
              <p className="text-xs text-slate-400">
                {formatFileSize(file.size)} ·{" "}
                <span className="text-amber-600">Pending</span>
              </p>
            </div>
            <button 
              type="button"
              disabled={disabled}
              onClick={() => onRemove(index)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              title="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PendingAttachmentList;
