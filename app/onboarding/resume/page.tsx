"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "@/components/Logo";
import Link from "next/link";

const LOADING_TEXTS = [
  "READING YOUR RESUME...",
  "FINDING YOUR PROJECTS...",
  "EXTRACTING YOUR SKILLS...",
  "ALMOST DONE..."
];

export default function ResumeUploadPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Cycle text effect when uploading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_TEXTS.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Explicit array to strictly control stagger order: "01", heading, upload zone, callout
    const targets = [
      containerRef.current.querySelector('.anim-number'),
      containerRef.current.querySelector('.anim-heading'),
      containerRef.current.querySelector('.anim-upload'),
      containerRef.current.querySelector('.anim-callout')
    ];

    gsap.fromTo(
      targets,
      { rotateX: -90, opacity: 0, y: 30, transformOrigin: "bottom center" },
      { rotateX: 0, opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: "power4.out" }
    );
    
    // Also animate step indicator gently
    gsap.fromTo(
      containerRef.current.querySelector('.anim-step'),
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 0.5 }
    );
  }, { scope: containerRef });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setIsUploading(true);
      setLoadingStep(0);
      
      // Simulate API call
      setTimeout(() => {
        setIsUploading(false);
      }, 4800);
    } else {
      alert("PDF only please.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isUploading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUploading && e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div ref={containerRef} className="h-screen w-screen bg-black overflow-hidden relative flex flex-col items-center perspective-[1200px]">
      
      {/* Top Logo - Fixed */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 hover:opacity-80 transition-opacity z-20">
        <Logo className="w-8 h-8 md:w-10 md:h-10 text-white" />
        <span className="text-xl md:text-2xl font-bold tracking-tighter font-headline text-white">
          C O L D C R A F T
        </span>
      </Link>

      {/* Step Indicator (Top Center) */}
      <div className="anim-step absolute top-24 md:top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 w-full px-4">
        <div className="flex gap-[8px] mb-4">
          <div className="w-[28px] h-[4px] bg-white rounded-sm" />
          <div className="w-[28px] h-[4px] bg-white/10 rounded-sm" />
          <div className="w-[28px] h-[4px] bg-white/10 rounded-sm" />
        </div>
        <div className="font-mono uppercase tracking-[0.2em] text-xs text-white/60 text-center whitespace-nowrap">
          STEP 01 OF 03 &mdash; UPLOAD RESUME
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-6xl px-4 md:px-12 flex flex-col justify-center items-center h-full">
        
        {/* Split Layout Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Left Column: 01 + Heading */}
          <div className="flex flex-col items-start justify-center">
            <div className="anim-number" style={{ transformStyle: "preserve-3d" }}>
              <h1 className="font-headline font-black text-[clamp(6rem,16vw,16rem)] leading-[0.8] tracking-tighter text-white m-0 p-0 block select-none">
                01
              </h1>
            </div>

            <div className="anim-heading mt-4 md:mt-2" style={{ transformStyle: "preserve-3d" }}>
              <h2 className="font-headline font-black uppercase text-[clamp(2.5rem,5vw,5rem)] leading-[0.85] tracking-tighter text-white select-none">
                <span className="whitespace-nowrap">First, your</span><br />
                <span className="whitespace-nowrap">resume.</span>
              </h2>
            </div>
          </div>

          {/* Right Column: Upload Box + Callout */}
          <div className="flex flex-col items-start md:items-end w-full">
            <div className="w-full max-w-xl">
              
              <div className="anim-heading font-body text-sm md:text-base leading-relaxed opacity-60 uppercase tracking-[0.2em] font-bold text-white mb-8 select-none" style={{ transformStyle: "preserve-3d" }}>
                WE EXTRACT EVERYTHING AUTOMATICALLY
              </div>

              {/* Upload zone */}
              <div className="anim-upload w-full" style={{ transformStyle: "preserve-3d" }}>
                <div 
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border border-dashed transition duration-300 rounded-none bg-white/[0.02] p-10 md:p-16 flex flex-col items-center justify-center min-h-[240px] relative
                    ${isUploading ? 'border-transparent cursor-default' : selectedFile ? 'border-white/40 cursor-default' : isDragging ? 'border-white cursor-pointer' : 'border-white/10 hover:border-white/40 cursor-pointer'}
                  `}
                >
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileInput}
                  />

                  {isUploading ? (
                    // Loading State
                    <div className="flex flex-col items-center justify-center w-full select-none">
                      <div className="flex gap-3 mb-8">
                        <div className="w-[8px] h-[8px] bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="w-[8px] h-[8px] bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                        <div className="w-[8px] h-[8px] bg-white rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
                      </div>
                      <div className="h-4 relative w-full flex justify-center items-center">
                        {LOADING_TEXTS.map((text, i) => (
                          <div 
                            key={i} 
                            className={`absolute font-mono uppercase tracking-[0.2em] text-xs text-white/60 transition-opacity duration-500 ${loadingStep === i ? 'opacity-100' : 'opacity-0'}`}
                          >
                            {text}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : selectedFile ? (
                    // Selected File State
                    <div className="flex items-center gap-6 w-full px-4 py-4">
                      <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="font-mono text-sm text-white truncate flex-1 text-left select-none">
                        {selectedFile.name}
                      </span>
                      <button 
                        onClick={clearFile}
                        className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors flex-shrink-0"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    // Default State
                    <div className="flex flex-col items-center text-center select-none">
                      <div className="w-10 h-10 border border-white/10 rounded-sm bg-white/5 flex items-center justify-center mb-6">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white/40">
                          <path d="M12 20V4M12 4L5 11M12 4L19 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="font-headline font-black text-2xl md:text-3xl tracking-tighter text-white uppercase mb-4">
                        DROP YOUR PDF HERE
                      </div>
                      <div className="font-mono uppercase tracking-[0.2em] text-[10px] md:text-xs text-white/40">
                        OR CLICK TO BROWSE &middot; PDF ONLY &middot; MAX 5MB
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Callout */}
              <div className="anim-callout mt-6 w-full border-l-2 border-white pl-5 py-3" style={{ transformStyle: "preserve-3d" }}>
                <p className="font-mono uppercase tracking-[0.2em] text-xs text-white/40 leading-relaxed select-none">
                  PARSED USING CLAUDE HAIKU 3.5 &middot; EXTRACTS NAME, LINKS, SKILLS, AND PROJECTS IN UNDER 3 SECONDS &middot; NOTHING IS STORED WITHOUT YOUR PERMISSION.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom trust line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono uppercase tracking-[0.2em] text-[10px] text-white/20 whitespace-nowrap select-none">
        YOUR DATA IS NEVER SOLD. EVER.
      </div>

    </div>
  );
}
