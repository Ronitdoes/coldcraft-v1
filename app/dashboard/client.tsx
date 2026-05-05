"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { gsap, useGSAP } from "@/lib/gsap";
import BrandHeader from "@/components/ui/BrandHeader";
import TextRollover from "@/components/TextRollover";
import Link from "next/link";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Chip from "@/components/ui/Chip";

// Types
type Profile = {
  full_name: string;
  college: string;
  year_of_study: string;
  github_url: string;
  linkedin_url: string;
  skills: string[];
  projects: string[];
};

type MailHistory = {
  id: string;
  recipient: string;
  company: string;
  role: string;
  tone: string;
  mail_type: string;
  position_type: string;
  word_limit: number;
  extra_context: string | null;
  subject: string;
  body: string;
  created_at: string;
};

export default function DashboardClient() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mailHistory, setMailHistory] = useState<MailHistory[]>([]);
  const [expandedMails, setExpandedMails] = useState<Set<string>>(new Set());
  const [toggleWord, setToggleWord] = useState(false);
  const [isPageAnimationFinished, setIsPageAnimationFinished] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    if (!isPageAnimationFinished) return;
    const interval = setInterval(() => {
      setToggleWord(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPageAnimationFinished]);

  // Derived State
  const greeting = getGreeting();
  const firstName = profile?.full_name?.split(" ")[0] || user?.user_metadata?.full_name?.split(" ")[0] || user?.user_metadata?.name?.split(" ")[0] || "THERE";

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      setUser(session.user);

      // Concurrent fetching
      const [profileResponse, mailResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('mail_history').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
      ]);

      if (profileResponse.data) setProfile(profileResponse.data);
      if (mailResponse.data) setMailHistory(mailResponse.data);

      setIsLoading(false);
    };

    fetchData();
  }, [router]);

  useGSAP(() => {
    if (isLoading || !containerRef.current) return;

    const tl = gsap.timeline({ 
      defaults: { ease: "power4.out" },
      onComplete: () => setIsPageAnimationFinished(true)
    });

    tl.fromTo(".greeting-char", {
      y: 100,
      opacity: 0,
      rotateX: -90,
      transformOrigin: "bottom center",
    }, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 1.2,
      stagger: 0.05,
    })
    .fromTo(
      ".anim-sub",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.6"
    )
    .fromTo(
      ['.anim-cta', '.anim-stats', '.anim-grid'],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
      "-=0.6"
    );
  }, [isLoading]);

  const toggleExpand = (id: string) => {
    setExpandedMails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleResend = (mail: MailHistory) => {
    const params = new URLSearchParams({
      recipient: mail.recipient || "",
      company: mail.company || "",
      role: mail.role || "",
      positionType: mail.position_type || "internship",
      mailType: mail.mail_type || "fresh",
      tone: mail.tone || "professional",
      wordLimit: String(mail.word_limit || 120),
    });
    router.push(`/compose?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black w-full overflow-x-hidden">
        {/* Nav Skeleton (Full Width) */}
        <div className="fixed top-0 left-0 right-0 h-24 bg-black border-b border-white/5 flex items-center justify-between px-8 z-[60]">
          <div className="w-32 h-6 bg-white/[0.08] animate-pulse" />
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white/[0.08] animate-pulse" />
            <div className="w-24 h-6 bg-white/[0.08] animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton (Centered like real content) */}
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-32 md:pt-40 w-full flex flex-col">
          {/* Greeting Skeleton */}
          <div className="mb-10 space-y-4">
            <div className="w-[60%] h-16 bg-white/[0.08] animate-pulse" />
            <div className="w-[40%] h-16 bg-white/[0.08] animate-pulse" />
            <div className="w-[30%] h-4 bg-white/[0.08] animate-pulse mt-4" />
          </div>

          {/* CTA Skeleton */}
          <div className="mb-12 flex flex-wrap gap-4">
            <div className="w-56 h-16 bg-white/[0.08] animate-pulse" />
            <div className="w-56 h-16 bg-white/[0.08] animate-pulse" />
          </div>

          {/* Stats Skeleton */}
          <div className="flex gap-16 border-t border-b border-white/5 py-8 mb-16">
            <div className="space-y-2">
              <div className="w-16 h-12 bg-white/[0.08] animate-pulse" />
              <div className="w-32 h-3 bg-white/[0.08] animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="w-16 h-12 bg-white/[0.08] animate-pulse" />
              <div className="w-32 h-3 bg-white/[0.08] animate-pulse" />
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="w-full space-y-4">
            <div className="w-48 h-6 bg-white/[0.08] animate-pulse mb-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-24 border border-white/5 bg-white/[0.03] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white pb-24">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/5 px-8 pt-8 pb-4 flex items-center justify-between">
        <BrandHeader />
        <div className="flex items-center gap-4 relative">
          <div 
            className="flex items-center gap-3 cursor-pointer group px-3 py-1.5 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            {user?.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-7 h-7 rounded-full object-cover border border-white/10"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="flex flex-col items-start">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 group-hover:text-white transition-colors">
                {profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0]}
              </span>
            </div>
            <svg 
              className={`w-3 h-3 text-white/20 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute top-full right-0 mt-4 w-72 bg-[#0A0A0A] border border-white/10 p-6 z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="font-headline font-black uppercase text-xl tracking-tighter text-white">
                    {profile?.full_name || "Anonymous User"}
                  </span>
                  <span className="font-mono uppercase tracking-[0.2em] text-[9px] text-white/40">
                    {profile?.college && profile?.year_of_study ? `${profile.college} • ${profile.year_of_study}` : user?.email}
                  </span>
                </div>

                {profile && (
                  <>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-headline uppercase tracking-widest text-[9px] font-bold text-on-surface-variant">SOCIALS</h3>
                      <div className="flex flex-wrap gap-4">
                        {profile.github_url && (
                          <a href={profile.github_url} target="_blank" rel="noreferrer" className="font-mono text-[9px] text-white/40 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-[0.15em]">
                            GITHUB <span className="text-white/20">&nearr;</span>
                          </a>
                        )}
                        {profile.linkedin_url && (
                          <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="font-mono text-[9px] text-white/40 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-[0.15em]">
                            LINKEDIN <span className="text-white/20">&nearr;</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {profile.skills && profile.skills.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="font-headline uppercase tracking-widest text-[9px] font-bold text-on-surface-variant">SKILLS</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, i) => (
                            <Chip key={i} label={skill} size="sm" className="border-white/5 text-white/30" />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-4 border-t border-white/5">
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left font-headline uppercase tracking-widest text-[10px] font-bold text-on-surface-variant hover:text-red-500 transition-colors flex items-center justify-between group"
                  >
                    <span>LOG OUT</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-12 pt-32 md:pt-40">
        
        {/* Hero Greeting */}
        <div className="anim-greeting mb-10 overflow-hidden">
          <h1 className="font-headline font-black uppercase text-[clamp(2.5rem,6vw,6rem)] leading-[0.85] tracking-tighter text-white" style={{ perspective: "1000px" }}>
            <span className="inline-block">
              {`${greeting},`.split("").map((char, i) => (
                <span key={`g-${i}`} className="greeting-char inline-block opacity-0" style={{ transformStyle: "preserve-3d" }}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <br />
            <span className="inline-block">
              {`${firstName}.`.split("").map((char, i) => (
                <span key={`n-${i}`} className="greeting-char inline-block opacity-0" style={{ transformStyle: "preserve-3d" }}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </h1>
          <div className="anim-sub font-mono uppercase tracking-[0.2em] text-[15px] text-white/40 mt-4 opacity-0 flex items-center justify-center">
            YOUR NEXT REPLY STARTS&nbsp;
            <TextRollover 
              text="HERE." 
              cloneText="NOW." 
              trigger={toggleWord}
              className="font-bold text-white"
              duration={0.6}
            />
          </div>
        </div>

        {/* Primary CTA */}
        <div className="anim-cta mb-12 flex flex-wrap gap-4 md:gap-6">
          <PrimaryButton 
            title="New Cold Mail"
            subtitle="Personalise"
            variant="flat"
            size="sm"
            onClick={() => router.push("/compose")}
            className="w-full md:w-auto"
          />
          <PrimaryButton 
            title="Follow Up Mail"
            subtitle="Stay Persistent"
            variant="flat"
            size="sm"
            onClick={() => router.push("/compose?type=followup")}
            className="w-full md:w-auto border border-white/10"
          />
        </div>

        {/* Main Grid */}
        <div className="anim-grid w-full">
          
          {/* Mail History */}
          <div className="w-full flex flex-col">
            <h2 className="font-headline uppercase tracking-widest text-lg font-bold text-on-surface-variant mb-6">
              MAIL HISTORY
            </h2>
            
            <div className="flex flex-col gap-3">
              {mailHistory.length === 0 ? (
                <div className="border border-dashed border-white/10 p-16 flex flex-col items-center justify-center gap-4">
                  <span className="font-mono uppercase tracking-[0.2em] text-[10px] text-white/20">
                    NO MAILS YET. START CRAFTING.
                  </span>
                </div>
              ) : (
                mailHistory.map((mail) => {
                  const isExpanded = expandedMails.has(mail.id);
                  const dateStr = new Date(mail.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
                  
                  return (
                    <div key={mail.id} className="border border-white/5 flex flex-col hover:border-white/20 transition-colors duration-200">
                      {/* Row Header */}
                      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          <span className="font-headline font-black uppercase text-base tracking-tighter text-white">
                            {mail.company} &mdash; {mail.role}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono uppercase tracking-[0.2em] text-[10px] text-white/30">
                              {dateStr}
                            </span>
                            <span className="font-mono uppercase tracking-[0.2em] text-[10px] text-white/40 border border-white/10 px-2 py-0.5">
                              {mail.tone}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <button 
                            onClick={() => toggleExpand(mail.id)}
                            className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 hover:text-white transition-colors"
                          >
                            {isExpanded ? 'CLOSE' : 'VIEW'}
                          </button>
                          <button 
                            onClick={() => handleResend(mail)}
                            className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 hover:text-white transition-colors"
                          >
                            RESEND
                          </button>
                        </div>
                      </div>

                      {/* Expanded View */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-white/5 mt-2 mx-6">
                          <p className="font-mono text-xs text-white/50 mb-4 tracking-widest uppercase">
                            SUBJECT: {mail.subject}
                          </p>
                          <div className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                            {mail.body}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "GOOD MORNING";
  if (hour < 18) return "GOOD AFTERNOON";
  return "GOOD EVENING";
}
