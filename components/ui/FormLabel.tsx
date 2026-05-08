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
        <label className="block font-headline font-bold uppercase tracking-widest text-[11px] md:text-xs text-on-surface-variant">
          {children}
        </label>
        <span className="font-mono text-[9px] md:text-[10px] text-white/20 uppercase tracking-[0.15em]">
          {rightText}
        </span>
      </div>
    );
  }

  return (
    <label className={`block font-headline font-bold uppercase tracking-widest text-[11px] md:text-xs text-on-surface-variant mb-1 ${className}`}>
      {children}
    </label>
  );
}
