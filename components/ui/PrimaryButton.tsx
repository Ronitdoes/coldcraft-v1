"use client";

import { useState } from "react";
import TextRollover from "@/components/TextRollover";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  subtitle: string;
  /** "default" = rounded with shadow (landing page), "flat" = sharp corners no shadow (dashboard/app) */
  variant?: "default" | "flat";
  /** Optional icon element (e.g., SVG) rendered before the title */
  icon?: React.ReactNode;
  /** Shows a spinner and disables interactions */
  loading?: boolean;
  /** Subtitle text shown during loading state */
  loadingSubtitle?: string;
}

export default function PrimaryButton({
  title,
  subtitle,
  variant = "default",
  icon,
  loading = false,
  loadingSubtitle = "Please wait...",
  className = "",
  disabled,
  ...props
}: PrimaryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = "bg-white text-black transition-all duration-300 active:scale-95 group flex flex-col items-center justify-center";
  const variantClasses = variant === "flat"
    ? "px-8 py-5 md:px-10 md:py-5 min-w-0"
    : "px-8 py-6 md:px-12 md:py-8 shadow-xl min-w-[280px] md:min-w-[400px] rounded-xl hover:scale-105 hover:shadow-2xl hover:bg-gray-200";

  const isDisabled = disabled || loading;

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""} relative z-10 ${className}`}
      {...props}
    >
      <span className="block font-headline font-bold text-2xl md:text-3xl mb-1 flex items-center gap-3">
        {loading ? (
          <>
            <svg className="animate-spin w-6 h-6 md:w-8 md:h-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {title}
          </>
        ) : (
          <>
            {icon}
            {title}
          </>
        )}
      </span>
      <span className="block font-body text-base md:text-lg opacity-70 font-medium flex items-center gap-2">
        <TextRollover text={loading ? loadingSubtitle : subtitle} trigger={loading ? true : isHovered} />
        {!loading && (
          <span className="relative overflow-hidden inline-flex items-center justify-center">
            <span className="material-symbols-outlined text-xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
              arrow_forward
            </span>
            <span className="material-symbols-outlined text-xl absolute transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] -translate-x-[150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0">
              arrow_forward
            </span>
          </span>
        )}
      </span>
    </button>
  );
}
