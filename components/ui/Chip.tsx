interface ChipProps {
  label: string;
  onRemove?: () => void;
  /** Visual size variant */
  size?: "sm" | "md";
  className?: string;
}

export default function Chip({ label, onRemove, size = "md", className = "" }: ChipProps) {
  const sizeClasses = size === "sm"
    ? "text-[8px] px-2 py-0.5"
    : "text-[11px] md:text-xs px-4 py-1.5";

  return (
    <div
      className={`border border-white/20 bg-black text-white/60 font-mono uppercase tracking-[0.2em] ${sizeClasses} rounded-none hover:border-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2 ${className}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-white/20 hover:text-white transition-colors focus:outline-none"
        >
          &times;
        </button>
      )}
    </div>
  );
}
