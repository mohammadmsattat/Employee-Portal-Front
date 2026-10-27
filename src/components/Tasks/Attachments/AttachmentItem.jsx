import { memo } from "react";
import { Download, Eye, Trash2 } from "lucide-react";
import {
  formatFileSize,
  getFileIcon,
  isPreviewable,
} from "@/utils/attachment.helper";

const AttachmentItem = ({
  attachment,
  onPreview,
  onDownload,
  onDelete,
  canDelete = false,
}) => {
  const Icon = getFileIcon(attachment.fileCategory);
  const canPreview = isPreviewable(attachment.fileCategory);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white p-3 transition hover:border-slate-300 hover:shadow-sm">
      {/* ICON */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>

      {/* INFO */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">
          {attachment.originalName}
        </p>
        <p className="text-xs text-slate-400">
          {formatFileSize(attachment.fileSize)}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex shrink-0 items-center gap-1">
        {canPreview && (
          <button
            type="button"
            onClick={() => onPreview(attachment)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onDownload(attachment)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </button>

        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(attachment)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(AttachmentItem);
