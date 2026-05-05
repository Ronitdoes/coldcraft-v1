import FormLabel from "./FormLabel";

interface FormInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  /** Right-aligned label text (e.g. "LOCKED · FROM GOOGLE") */
  labelRightText?: string;
  className?: string;
  /** Animation class for GSAP targeting */
  animClass?: string;
}

export default function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly = false,
  labelRightText,
  className = "",
  animClass,
}: FormInputProps) {
  return (
    <div className={`w-full ${animClass || ""}`} style={animClass ? { transformStyle: "preserve-3d" } : undefined}>
      <FormLabel rightText={labelRightText}>{label}</FormLabel>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        className={`w-full bg-white/[0.02] border text-white font-body text-sm md:text-base px-4 py-2.5 md:py-3 rounded-none focus:outline-none transition-colors duration-200 placeholder:text-white/20 ${
          readOnly
            ? "border-white/10 text-white/30 cursor-not-allowed"
            : "border-white/20 focus:border-white/40"
        } ${className}`}
      />
    </div>
  );
}
