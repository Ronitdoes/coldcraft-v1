"use client";

import { useState } from "react";
import Chip from "./Chip";
import FormLabel from "./FormLabel";

interface ChipGroupProps {
  label: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  addButtonText?: string;
  /** Animation class for GSAP targeting */
  animClass?: string;
}

export default function ChipGroup({
  label,
  items,
  onItemsChange,
  addButtonText = "+ ADD",
  animClass,
}: ChipGroupProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newItem.trim()) {
      onItemsChange([...items, newItem.trim()]);
      setNewItem("");
      setIsAdding(false);
    } else if (e.key === "Escape") {
      setNewItem("");
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`w-full mt-1 ${animClass || ""}`}
      style={animClass ? { transformStyle: "preserve-3d" } : undefined}
    >
      <FormLabel className="mb-2">{label}</FormLabel>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Chip key={i} label={item} onRemove={() => handleRemove(i)} />
        ))}

        {isAdding ? (
          <input
            autoFocus
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsAdding(false)}
            className="border border-white/40 bg-white/[0.02] text-white font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-none focus:outline-none min-w-[120px]"
            placeholder="PRESS ENTER"
          />
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="border border-dashed border-white/20 text-white/30 font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-none hover:border-white/40 hover:text-white transition-colors duration-200"
          >
            {addButtonText}
          </button>
        )}
      </div>
    </div>
  );
}
