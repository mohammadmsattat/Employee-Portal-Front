import { memo } from "react";
import { Paperclip } from "lucide-react";
import AttachmentItem from "./AttachmentItem";

const AttachmentList = ({
  attachments = [],
  onPreview,
  onDownload,
  onDelete,
  canDelete = false,
}) => {
  if (!attachments.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-6 text-slate-400">
        <Paperclip className="h-5 w-5" />
        <p className="text-xs">No attachments yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {attachments.map((attachment) => (
        <AttachmentItem
          key={attachment._id}
          attachment={attachment}
          onPreview={onPreview}
          onDownload={onDownload}
          onDelete={onDelete}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
};

export default memo(AttachmentList);
