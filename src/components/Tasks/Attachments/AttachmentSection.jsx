import { memo, useMemo, useState } from "react";
import { Paperclip } from "lucide-react";

import {
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} from "@/rtk/Tasks/attachmentsApi";

import AttachmentUploader from "./AttachmentUploader";
import AttachmentList from "./AttachmentList";

const AttachmentSection = ({
  listId,
  taskId,
  attachments = [],
  canUpload = false,
  canDelete = false,
  refetch,
}) => {
  const [uploadAttachment] = useUploadAttachmentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();

  const count = attachments.length;

  const handleUpload = async (file) => {
    try {
      await uploadAttachment({ listId, taskId, file }).unwrap();
      refetch?.();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDelete = async (attachment) => {
    if (!window.confirm(`Delete "${attachment.originalName}"?`)) return;

    try {
      await deleteAttachment({
        listId,
        taskId,
        attachmentId: attachment._id,
      }).unwrap();
      refetch?.();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ======================================
  // PREVIEW
  // ======================================
  const handlePreview = async (attachment) => {
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8006";
    const url = `${base}/api/lists/${listId}/tasks/${taskId}/attachments/${attachment._id}/preview`;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to preview file");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      // احذف الـ blob بعد شوية
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      console.error("Preview error:", err);
    }
  };

  // ======================================
  // DOWNLOAD
  // ======================================
  const handleDownload = async (attachment) => {
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8006";
    const url = `${base}/api/lists/${listId}/tasks/${taskId}/attachments/${attachment._id}/download`;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // أنشئ رابط تحميل مؤقت
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = attachment.originalName || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // احذف الـ blob
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-4">
      {/* HEADER */}
      <div className="mb-3 flex items-center gap-2">
        <Paperclip className="h-4 w-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-700">Attachments</span>
        {count > 0 && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            {count}
          </span>
        )}
      </div>

      {/* UPLOADER */}
      {canUpload && (
        <div className="mb-3">
          <AttachmentUploader onUpload={handleUpload} canUpload={canUpload} />
        </div>
      )}

      {/* LIST */}
      <AttachmentList
        attachments={attachments}
        onPreview={handlePreview}
        onDownload={handleDownload}
        onDelete={handleDelete}
        canDelete={canDelete}
      />
    </section>
  );
};

export default memo(AttachmentSection);
