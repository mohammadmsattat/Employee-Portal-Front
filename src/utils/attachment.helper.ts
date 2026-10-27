import {
  FileText,
  FileSpreadsheet,
  FileType,
  Image as ImageIcon,
  Paperclip,
  Presentation,
  Archive,
  type LucideIcon,
} from "lucide-react";

// =========================
// FILE SIZE
// =========================
export const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

// =========================
// FILE ICON
// =========================
export const getFileIcon = (category?: string): LucideIcon => {
  switch (category) {
    case "image":
      return ImageIcon;
    case "pdf":
      return FileText;
    case "word":
      return FileType;
    case "excel":
      return FileSpreadsheet;
    case "powerpoint":
      return Presentation;
    case "archive":
      return Archive;
    case "text":
      return FileText;
    default:
      return Paperclip;
  }
};

// =========================
// PREVIEWABLE
// =========================
export const isPreviewable = (category?: string): boolean => {
  return category === "image" || category === "pdf";
};

// =========================
// VALIDATION
// =========================
export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/vnd.rar",
  "application/x-7z-compressed",
];

export const validateFile = (
  file: File,
): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File is too large (max 15MB)" };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype || file.type)) {
    return { valid: false, error: "File type is not allowed" };
  }

  return { valid: true };
};
