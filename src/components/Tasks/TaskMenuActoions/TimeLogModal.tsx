import { useState } from "react";
import { X, Clock } from "lucide-react";

const UpdateTaskTimeLogModal = ({ isOpen, onClose, task }) => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    duration: "",
    note: "",
  });

  if (!isOpen) return null;

  return (
    <div className="w-[320px] bg-white border rounded-2xl shadow-xl p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Add Time Log
        </h2>

        <button onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* FORM */}
      <div className="space-y-3">
        <input
          type="datetime-local"
          value={form.from}
          onChange={(e) =>
            setForm((p) => ({ ...p, from: e.target.value }))
          }
          className="w-full border rounded-md p-2 text-xs"
        />

        <input
          type="datetime-local"
          value={form.to}
          onChange={(e) =>
            setForm((p) => ({ ...p, to: e.target.value }))
          }
          className="w-full border rounded-md p-2 text-xs"
        />

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={(e) =>
            setForm((p) => ({ ...p, duration: e.target.value }))
          }
          className="w-full border rounded-md p-2 text-xs"
        />

        <textarea
          placeholder="Note..."
          value={form.note}
          onChange={(e) =>
            setForm((p) => ({ ...p, note: e.target.value }))
          }
          className="w-full border rounded-md p-2 text-xs"
        />
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">
        <button
          className="flex-1 bg-blue-600 text-white py-2 text-xs rounded-md"
          onClick={() => {
            console.log("submit", form);
          }}
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="flex-1 bg-slate-100 py-2 text-xs rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskTimeLogModal;