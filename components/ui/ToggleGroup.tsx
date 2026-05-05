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
  onChange: (value: any) => void;
  /** Grid columns for layout (default: auto-flow) */
  columns?: number;
  /** Optional hint text below the group */
  hint?: string;
}

export default function ToggleGroup({
  label,
  options,
  value,
  onChange,
  columns,
  hint,
}: ToggleGroupProps) {
  const gridClass = columns ? `grid grid-cols-${columns} gap-2` : "flex gap-2";

  return (
    <div>
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
                } font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-all duration-200 w-full text-left`}
              >
                {option.label}
              </button>
              {option.description && (
                <span className="font-mono text-[8px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity mt-1 tracking-widest pl-1">
                  {option.description}
                </span>
              )}
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
