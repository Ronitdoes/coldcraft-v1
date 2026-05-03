"use client";

import { useState } from "react";
import TextRollover from "@/components/TextRollover";

interface PrimaryButtonProps {
  title: string;
  subtitle: string;
}

export default function PrimaryButton({ title, subtitle }: PrimaryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white text-black px-8 py-6 md:px-12 md:py-8 transition-all duration-300 hover:bg-gray-200 active:scale-95 group shadow-xl flex flex-col items-center justify-center min-w-[280px] md:min-w-[400px] rounded-xl hover:scale-105 hover:shadow-2xl relative z-10"
    >
      <span className="block font-headline font-bold text-2xl md:text-3xl mb-1">
        {title}
      </span>
      <span className="block font-body text-base md:text-lg opacity-70 font-medium flex items-center gap-2">
        <TextRollover text={subtitle} trigger={isHovered} />
        <span className="relative overflow-hidden inline-flex items-center justify-center">
          <span className="material-symbols-outlined text-xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
            arrow_forward
          </span>
          <span className="material-symbols-outlined text-xl absolute transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] -translate-x-[150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0">
            arrow_forward
          </span>
        </span>
      </span>
    </button>
  );
}
