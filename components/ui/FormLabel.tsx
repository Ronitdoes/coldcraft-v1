interface FormLabelProps {
  children: React.ReactNode;
  className?: string;
  /** Right-aligned secondary text (e.g. "LOCKED · FROM GOOGLE") */
  rightText?: string;
}

export default function FormLabel({ children, className = "", rightText }: FormLabelProps) {
  if (rightText) {
    return (
      <div className={`flex justify-between items-end mb-1 ${className}`}>
        <label className="block font-mono uppercase tracking-[0.25em] text-[11px] md:text-xs text-white/40">
          {children}
        </label>
        <span className="font-mono text-[9px] md:text-[10px] text-white/20 uppercase tracking-[0.15em]">
          {rightText}
        </span>
      </div>
    );
  }

  return (
    <label className={`block font-mono uppercase tracking-[0.25em] text-[11px] md:text-xs text-white/40 mb-1 ${className}`}>
      {children}
    </label>
  );
}
