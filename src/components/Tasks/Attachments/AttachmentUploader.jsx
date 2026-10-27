import { memo, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { validateFile } from "@/utils/attachment.helper";

const AttachmentUploader = ({ onUpload, canUpload = false }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!canUpload) return null;

  const handleFile = async (file) => {
    if (!file) return;

    setError(null);

    const { valid, error: validationError } = validateFile(file);

    if (!valid) {
      setError(validationError);
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(file);
    } catch (err) {
      setError(err?.data?.message || err?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    handleFile(file);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          flex cursor-pointer items-center justify-center gap-2
          rounded-xl border-2 border-dashed px-4 py-3
          text-sm font-medium transition
          ${
            isDragging
              ? "border-blue-400 bg-blue-50 text-blue-600"
              : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:bg-blue-50/40 hover:text-blue-600"
          }
          ${isUploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            <span>Click or drag file here</span>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default memo(AttachmentUploader);
