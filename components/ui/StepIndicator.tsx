interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  label: string;
  className?: string;
}

export default function StepIndicator({ currentStep, totalSteps, label, className = "" }: StepIndicatorProps) {
  return (
    <div className={`flex flex-col items-center z-10 w-full px-4 ${className}`}>
      <div className="flex gap-[6px] mb-4">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-[28px] h-[4px] rounded-sm ${
              i + 1 <= currentStep ? "bg-white" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <div className="font-mono uppercase tracking-[0.2em] text-xs text-white/60 text-center whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}
