"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "@/components/Logo";
import TextRollover from "@/components/TextRollover";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      ".auth-title-char",
      { y: 150, opacity: 0, rotateX: -90, transformOrigin: "bottom center" },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.05, delay: 0.2 }
    )
      .fromTo(
        ".auth-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.6"
      )
      .fromTo(
        ".auth-btn-wrapper",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)", clearProps: "transform" },
        "-=0.6"
      );
  }, { scope: containerRef });

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error logging in:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden perspective-[1000px] px-4">
      {/* Decorative background grid/noise (optional, to match theme) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent pointer-events-none z-0" />

      {/* Top Logo - Fixed */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <Logo className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        <span className="text-xl md:text-2xl font-bold tracking-tighter font-headline text-primary">
          C O L D C R A F T
        </span>
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl z-10 text-center">
        <h1 className="font-headline font-black text-[clamp(3rem,9vw,15rem)] leading-[0.85] kerning-tight text-primary select-none mb-6 text-center w-full">
          <span className="flex flex-nowrap justify-center overflow-visible whitespace-nowrap">
            {"NO MORE GHOSTING".split("").map((char, i) => (
              <span key={`nomoreghosting-${i}`} className="auth-title-char inline-block opacity-0 whitespace-pre" style={{ transformStyle: "preserve-3d" }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <div className="auth-subtitle opacity-0 translate-y-8 flex flex-col items-center mt-8 md:mt-12 mb-12">
          <p className="font-body text-sm md:text-base leading-relaxed opacity-60 uppercase tracking-[0.2em] font-bold">
            STOP GETTING IGNORED.
            <br />
            90 SECONDS TO YOUR FIRST COLD MAIL
          </p>
        </div>

        <div className="auth-btn-wrapper opacity-0">
          <button
            onClick={handleGoogleLogin}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            disabled={isLoading}
            className="bg-white text-black px-8 py-6 md:px-12 md:py-8 transition-all duration-300 hover:bg-gray-200 active:scale-95 group shadow-xl flex flex-col items-center justify-center min-w-[280px] md:min-w-[400px] rounded-xl hover:scale-110 hover:shadow-2xl relative z-10"
          >
            {isLoading ? (
              <>
                <span className="block font-headline font-bold text-2xl md:text-3xl mb-1 flex items-center gap-3">
                  <svg className="animate-spin w-6 h-6 md:w-8 md:h-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AUTHENTICATING
                </span>
                <span className="block font-body text-base md:text-lg opacity-70 font-medium flex items-center gap-2">
                  <TextRollover text="Please wait..." trigger={true} />
                </span>
              </>
            ) : (
              <>
                <span className="block font-headline font-bold text-2xl md:text-3xl mb-1 flex items-center gap-3">
                  {/* Google G icon SVG */}
                  <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </span>
                <span className="block font-body text-base md:text-lg opacity-70 font-medium flex items-center gap-2">
                  <TextRollover text="Secure & fast login" trigger={isBtnHovered} />
                  <span className="relative overflow-hidden inline-flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
                      arrow_forward
                    </span>
                    <span className="material-symbols-outlined text-xl absolute transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] -translate-x-[150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0">
                      arrow_forward
                    </span>
                  </span>
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
