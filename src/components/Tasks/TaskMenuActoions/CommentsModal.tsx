import { useState } from "react";
import { useCommentsModal } from "@/hooks/Tasks/TaskMenuActions/useCommentsModal ";
import { Task } from "@/interfaces/tasks";

interface Props {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateTaskCommentsModal = ({ task, isOpen, onClose }: Props) => {
  const { comments, addComment, removeComment } =
    useCommentsModal({ task });
console.log("111111",comments);

  const [text, setText] = useState("");

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-80 w-full">
      {/* HEADER */}
      <div className="border-b pb-2 mb-2">
        <h2 className="text-sm font-semibold text-slate-700">
          Comments
        </h2>
      </div>

      {/* COMMENTS LIST */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 ">
        {comments.length === 0 && (
          <p className="text-xs text-slate-400 text-center mt-10">
            No comments yet
          </p>
        )}

        {comments.map((c) => (
          <div
            key={c._id}
            className="group bg-slate-50 rounded-lg p-2 text-xs "
          >
            {/* USER + DATE */}
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>{c.createdBy?.fullName}</span>
              <span>
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* CONTENT */}
            <div className="text-slate-700">
              {c.content}
            </div>

            {/* DELETE */}
            {/* <button
              onClick={() => removeComment(c._id)}
              className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 mt-1"
            >
              delete
            </button> */}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="pt-2 border-t mt-2">
        <input
          className="w-full border rounded-md p-2 text-xs outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={() => {
            addComment(text);
            setText("");
          }}
          className="w-full mt-2 bg-blue-600 text-white text-xs py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add comment
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskCommentsModal;