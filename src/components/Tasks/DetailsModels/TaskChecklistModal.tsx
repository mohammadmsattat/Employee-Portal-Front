import { X, Plus, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const TaskChecklistModal = ({ isOpen, onClose, task }) => {
  const [items, setItems] = useState(task?.checklist || []);
  const [newItem, setNewItem] = useState("");

  if (!isOpen || !task) return null;

  const addItem = () => {
    if (!newItem.trim()) return;

    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newItem, done: false },
    ]);

    setNewItem("");
  };

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Checklist</h3>

          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-3">
          {/* ADD ITEM */}
          <div className="flex gap-2">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="New item..."
            />

            <Button onClick={addItem} className="rounded-lg">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* ITEMS */}
          <div className="space-y-2 max-h-60 overflow-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleItem(item.id)}>
                    <Check
                      className={`h-4 w-4 ${
                        item.done ? "text-green-600" : "text-slate-300"
                      }`}
                    />
                  </button>

                  <span
                    className={
                      item.done ? "line-through text-slate-400" : ""
                    }
                  >
                    {item.title}
                  </span>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-red-500"
                >
                  remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskChecklistModal;