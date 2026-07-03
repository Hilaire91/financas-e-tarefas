import React, { useState } from "react";
import { ChecklistItem } from "../types";
import { Check, Plus, Trash2, X } from "lucide-react";

interface TaskChecklistProps {
  items: ChecklistItem[];
  onUpdate: (newItems: ChecklistItem[]) => void;
  isDarkMode: boolean;
}

export default function TaskChecklist({ items, onUpdate, isDarkMode }: TaskChecklistProps) {
    const [newItemText, setNewItemText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: "item-" + Date.now(),
      text: newItemText,
      completed: false
    };
    
    onUpdate([...items, newItem]);
    setNewItemText("");
  };

  const toggleItem = (id: string) => {
    onUpdate(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const deleteItem = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  return (
    <div className="mt-3 pl-7 w-full border-t border-gray-100 dark:border-gray-800/50 pt-3">
      {items.length > 0 && (
        <div className="space-y-1.5 mb-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                  className="w-3 h-3 text-violet-600 focus:ring-violet-500 rounded-sm border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <span className={`text-[11px] ${item.completed ? "line-through text-gray-500" : isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {item.text}
                </span>
              </div>
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 transition-all p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <form onSubmit={handleAddItem} className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Item da lista..."
            autoFocus
            className={`flex-1 py-1 px-2 text-[11px] rounded-lg border focus:outline-none focus:ring-1 focus:ring-violet-500 ${
              isDarkMode ? "bg-gray-800/50 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
          />
          <button
            type="submit"
            className="p-1 rounded-md bg-violet-100 text-violet-600 hover:bg-violet-200 dark:bg-violet-500/20 dark:text-violet-400 dark:hover:bg-violet-500/30 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewItemText("");
            }}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className={`text-[10px] font-semibold flex items-center gap-1 mt-1 hover:underline ${
            isDarkMode ? "text-violet-400" : "text-violet-600"
          }`}
        >
          <Plus className="w-3 h-3" /> Adicionar item à lista (ex: compras)
        </button>
      )}
    </div>
  );
}
