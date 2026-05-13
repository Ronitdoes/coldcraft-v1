import FormLabel from "./FormLabel";

export interface ToggleOption {
  id: string;
  label: string;
  /** Optional tooltip shown on hover */
  description?: string;
}

interface ToggleGroupProps {
  label: string;
  options: ToggleOption[];
  value: string | number;
  onChange: (value: string) => void;
  /** Grid columns for layout (default: auto-flow) */
  columns?: number;
  /** Optional hint text below the group */
  hint?: string;
  /** Disable all interactions */
  disabled?: boolean;
}

export default function ToggleGroup({
  label,
  options,
  value,
  onChange,
  columns,
  hint,
  disabled,
}: ToggleGroupProps) {
  const gridClass = columns 
    ? `grid grid-cols-1 ${columns === 2 ? 'sm:grid-cols-2' : columns === 3 ? 'sm:grid-cols-3' : `md:grid-cols-${columns}`} gap-2` 
    : "flex flex-wrap gap-2";

  return (
    <div className={disabled ? "opacity-40 pointer-events-none" : ""}>
      <FormLabel>{label}</FormLabel>
      <div className={gridClass}>
        {options.map((option) => {
          const isActive = String(value) === String(option.id);
          return (
            <div key={option.id} className="flex flex-col group">
              <button
                onClick={() => onChange(option.id)}
                className={`${
                  isActive
                    ? "bg-white text-black"
                    : "border border-white/10 text-white/40 group-hover:border-white/30 group-hover:text-white/60"
                } font-mono text-[11px] uppercase tracking-[0.2em] px-5 py-3 w-full text-left transition-colors duration-200`}
              >
                {option.label}
              </button>
              
              {/* Expandable description area to avoid excessive empty space */}
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
                <div className="overflow-hidden">
                  {option.description && (
                    <span className="block font-mono text-[10px] text-white/50 pt-2 pb-1 tracking-widest pl-1">
                      {option.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {hint && (
        <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-white/20 mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
