import { useState } from "react";

export const AddListModal = ({ isOpen, onClose, onSubmit, folderId, workspaceId }) => {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/30 flex items-center justify-center">
      <div className="bg-white w-96 rounded-xl shadow-lg p-4">
        <h2 className="font-bold mb-3">Add List</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="List name"
          className="border w-full p-2 rounded"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={() => {
              onSubmit?.({ name, folderId, workspaceId });
              setName("");
              onClose();
            }}
            className="bg-purple-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};