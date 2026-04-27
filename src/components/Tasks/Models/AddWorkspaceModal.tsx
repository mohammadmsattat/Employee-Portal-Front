import { useState } from "react";

export const AddWorkspaceModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/30 flex items-center justify-center">
      <div className="bg-white w-96 rounded-xl shadow-lg p-4">
        <h2 className="font-bold mb-3">Add Workspace</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name"
          className="border w-full p-2 rounded"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={() => {
              onSubmit?.({ name });
              setName("");
              onClose();
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};