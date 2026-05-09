import { useAttachmentsModal } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/useAttachmentsModal ";
import { Task } from "@/interfaces/tasks";
import { useState } from "react";

const UpdateTaskAttachmentsModal = ({
  task,
  isOpen,
  onClose,
  
}: {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { attachments, addAttachment, removeAttachment } = useAttachmentsModal({
    task,
  });

  const [url, setUrl] = useState("");

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-80 w-full">
      {/* HEADER */}
      <div className="border-b pb-2 mb-2">
        <h2 className="text-sm font-semibold text-slate-700">Attachments</h2>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {attachments.length === 0 && (
          <p className="text-xs text-slate-400 text-center mt-10">
            No attachments yet
          </p>
        )}
        {/* 
        {attachments?.map((a: any) => (
          <div
            key={a._id}
            className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs"
          >
            <a href={a.url} target="_blank" className="text-blue-600 truncate">
              {a.url}
            </a>

            <button
              onClick={() => removeAttachment(a._id)}
              className="text-red-400 text-[10px]"
            >
              delete
            </button>
          </div>
        ))} */}
      </div>

      {/* INPUT */}
      <div className="pt-2 border-t mt-2">
        <input
          className="w-full border rounded-md p-2 text-xs"
          placeholder="Paste file URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={() => {
            addAttachment(url);
            setUrl("");
          }}
          className="w-full mt-2 bg-blue-600 text-white text-xs py-2 rounded-md"
        >
          Add attachment
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskAttachmentsModal;
