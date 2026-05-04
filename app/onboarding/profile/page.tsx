"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Logo from "@/components/Logo";
import PrimaryButton from "@/components/ui/PrimaryButton";

// Mock data representing the extracted resume
const MOCK_EXTRACTED_DATA = {
  full_name: "Ronit Gandhi",
  college: "VIT Vellore",
  year_of_study: "2026",
  github_url: "github.com/ronitdoes",
  linkedin_url: "linkedin.com/in/ronitgandhi",
  skills: ["React", "Next.js", "TypeScript", "GSAP"],
  projects: ["ColdCraft", "Charity Platform"]
};

export default function ProfileReviewPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [userEmail, setUserEmail] = useState("loading...");
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: MOCK_EXTRACTED_DATA.full_name,
    college: MOCK_EXTRACTED_DATA.college,
    year_of_study: MOCK_EXTRACTED_DATA.year_of_study,
    github_url: MOCK_EXTRACTED_DATA.github_url,
    linkedin_url: MOCK_EXTRACTED_DATA.linkedin_url,
  });

  const [skills, setSkills] = useState(MOCK_EXTRACTED_DATA.skills);
  const [projects, setProjects] = useState(MOCK_EXTRACTED_DATA.projects);
  
  const [newSkill, setNewSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  
  const [newProject, setNewProject] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Fetch logged in user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || "NO EMAIL FOUND");
        setUserId(user.id);
      } else {
        setUserEmail("NOT AUTHENTICATED");
      }
    });
  }, [supabase.auth]);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(
      ['.anim-number', '.anim-heading', '.anim-fields', '.anim-chips', '.anim-cta'],
      { rotateX: -90, opacity: 0, y: 30, transformOrigin: 'bottom center' },
      { rotateX: 0, opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'power4.out' }
    );
  }, { scope: containerRef });

  const handleSave = async () => {
    if (!userId) {
      alert("No authenticated user found. In a real app, this would redirect to login.");
      return;
    }
    setIsSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: formData.full_name,
        email: userEmail,
        college: formData.college,
        year_of_study: formData.year_of_study,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        skills,
        projects
      });
      
    if (error) {
      console.error(error);
      alert("Failed to save profile. Make sure the 'profiles' table exists in Supabase.");
      setIsSaving(false);
      return;
    }
    
    router.push("/dashboard");
  };

  const removeChip = (type: 'skill' | 'project', index: number) => {
    if (type === 'skill') {
      setSkills(skills.filter((_, i) => i !== index));
    } else {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setIsAddingSkill(false);
    } else if (e.key === 'Escape') {
      setNewSkill("");
      setIsAddingSkill(false);
    }
  };

  const handleProjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newProject.trim()) {
      setProjects([...projects, newProject.trim()]);
      setNewProject("");
      setIsAddingProject(false);
    } else if (e.key === 'Escape') {
      setNewProject("");
      setIsAddingProject(false);
    }
  };

  return (
    <div ref={containerRef} className="h-screen w-screen bg-black overflow-hidden relative perspective-[1200px]">
      
      {/* Top Left Logo - Fixed */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 hover:opacity-80 transition-opacity z-20">
        <Logo className="w-8 h-8 md:w-10 md:h-10 text-white" />
        <span className="text-xl md:text-2xl font-bold tracking-tighter font-headline text-white">
          C O L D C R A F T
        </span>
      </Link>

      {/* Step Indicator */}
      <div className="absolute top-24 md:top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 w-full px-4">
        <div className="flex gap-[6px] mb-4">
          <div className="w-[28px] h-[4px] bg-white/10 rounded-sm" />
          <div className="w-[28px] h-[4px] bg-white rounded-sm" />
        </div>
        <div className="font-mono uppercase tracking-[0.2em] text-xs text-white/60 text-center whitespace-nowrap">
          STEP 02 OF 02 &mdash; REVIEW YOUR PROFILE
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center h-full mx-auto">
        
        {/* Left Column */}
        <div className="flex flex-col items-start justify-center h-full pt-16 md:pt-0">
          <div className="anim-number" style={{ transformStyle: 'preserve-3d' }}>
            <h1 className="font-headline font-black text-[clamp(6rem,16vw,16rem)] leading-[0.8] tracking-tighter text-white m-0 p-0 block select-none">
              02
            </h1>
          </div>
          
          <div className="anim-heading mt-2" style={{ transformStyle: 'preserve-3d' }}>
            <h2 className="font-headline font-black uppercase text-[clamp(2.5rem,5vw,5rem)] leading-[0.85] tracking-tighter text-white select-none">
              <span className="whitespace-nowrap">THIS</span><br />
              <span className="whitespace-nowrap">YOU?</span>
            </h2>
            <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-white/40 mt-6 select-none">
              WE FOUND 7 FIELDS &middot; REVIEW BEFORE CONTINUING
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-start md:items-end w-full max-w-xl mx-auto justify-center pb-4 md:pb-0">
          <div className="w-full flex flex-col gap-4">
            
            {/* Full Name */}
            <div className="anim-fields w-full" style={{ transformStyle: 'preserve-3d' }}>
              <label className="block font-mono uppercase tracking-[0.25em] text-[11px] md:text-xs text-white/40 mb-1">
                FULL NAME
              </label>
              <input 
                type="text"
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                className="w-full bg-white/[0.02] border border-white/20 text-white font-body text-base px-4 py-3 rounded-none focus:outline-none focus:border-white/40 transition-colors duration-200 placeholder:text-white/20"
              />
            </div>

            {/* Email Locked */}
            <div className="anim-fields w-full" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex justify-between items-end mb-1">
                <label className="block font-mono uppercase tracking-[0.25em] text-[11px] md:text-xs text-white/40">
                  EMAIL
                </label>
                <span className="font-mono text-[9px] md:text-[10px] text-white/20 uppercase tracking-[0.15em]">
                  LOCKED &middot; FROM GOOGLE
                </span>
              </div>
              <input 
                type="email"
                readOnly
                value={userEmail}
                className="w-full bg-white/[0.02] border border-white/10 text-white/30 cursor-not-allowed font-body text-base px-4 py-3 rounded-none focus:outline-none transition-colors duration-200"
              />
            </div>

            {/* College & Year Grid */}
            <div className="anim-fields w-full grid grid-cols-2 gap-4" style={{ transformStyle: 'preserve-3d' }}>
              <div>
                <label className="block font-mono uppercase tracking-[0.25em] text-[11px] md:text-xs text-white/40 mb-1">
                  COLLEGE
                </label>
                <input 
                  type="text"
                  value={formData.college}
                  onChange={e => setFormData({...formData, college: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/20 text-white font-body text-base px-4 py-3 rounded-none focus:outline-none focus:border-white/40 transition-colors duration-200 placeholder:text-white/20"
                />
              </div>
              <div>
                <label className="block font-mono uppercase tracking-[0.25em] text-[11px] md:text-xs text-white/40 mb-1">
                  YEAR OF STUDY
                </label>
                <input 
                  type="text"
                  value={formData.year_of_study}
                  onChange={e => setFormData({...formData, year_of_study: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/20 text-white font-body text-base px-4 py-3 rounded-none focus:outline-none focus:border-white/40 transition-colors duration-200 placeholder:text-white/20"
                />
              </div>
            </div>

            {/* GitHub & LinkedIn Grid */}
            <div className="anim-fields w-full grid grid-cols-2 gap-4" style={{ transformStyle: 'preserve-3d' }}>
              <div>
                <label className="block font-mono uppercase tracking-[0.25em] text-[11px] md:text-xs text-white/40 mb-1">
                  GITHUB URL
                </label>
                <input 
                  type="text"
                  value={formData.github_url}
                  onChange={e => setFormData({...formData, github_url: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/20 text-white font-body text-base px-4 py-3 rounded-none focus:outline-none focus:border-white/40 transition-colors duration-200 placeholder:text-white/20"
                />
              </div>
              <div>
                <label className="block font-mono uppercase tracking-[0.25em] text-[11px] md:text-xs text-white/40 mb-1">
                  LINKEDIN URL
                </label>
                <input 
                  type="text"
                  value={formData.linkedin_url}
                  onChange={e => setFormData({...formData, linkedin_url: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/20 text-white font-body text-base px-4 py-3 rounded-none focus:outline-none focus:border-white/40 transition-colors duration-200 placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Skills Row */}
            <div className="anim-chips w-full mt-1" style={{ transformStyle: 'preserve-3d' }}>
              <label className="block font-mono uppercase tracking-[0.25em] text-[11px] md:text-xs text-white/40 mb-2">
                SKILLS
              </label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <div key={i} className="border border-white/20 bg-black text-white/60 font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-none hover:border-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2">
                    {skill}
                    <button onClick={() => removeChip('skill', i)} className="text-white/20 hover:text-white transition-colors focus:outline-none">
                      &times;
                    </button>
                  </div>
                ))}
                
                {isAddingSkill ? (
                  <input 
                    autoFocus
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onBlur={() => setIsAddingSkill(false)}
                    className="border border-white/40 bg-white/[0.02] text-white font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-none focus:outline-none min-w-[120px]"
                    placeholder="PRESS ENTER"
                  />
                ) : (
                  <button 
                    onClick={() => setIsAddingSkill(true)}
                    className="border border-dashed border-white/20 text-white/30 font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-none hover:border-white/40 hover:text-white transition-colors duration-200"
                  >
                    + ADD SKILL
                  </button>
                )}
              </div>
            </div>

            {/* Projects Row */}
            <div className="anim-chips w-full mt-1" style={{ transformStyle: 'preserve-3d' }}>
              <label className="block font-mono uppercase tracking-[0.25em] text-[11px] md:text-xs text-white/40 mb-2">
                KEY PROJECTS
              </label>
              <div className="flex flex-wrap gap-2">
                {projects.map((project, i) => (
                  <div key={i} className="border border-white/20 bg-black text-white/60 font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-none hover:border-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2">
                    {project}
                    <button onClick={() => removeChip('project', i)} className="text-white/20 hover:text-white transition-colors focus:outline-none">
                      &times;
                    </button>
                  </div>
                ))}
                
                {isAddingProject ? (
                  <input 
                    autoFocus
                    type="text"
                    value={newProject}
                    onChange={e => setNewProject(e.target.value)}
                    onKeyDown={handleProjectKeyDown}
                    onBlur={() => setIsAddingProject(false)}
                    className="border border-white/40 bg-white/[0.02] text-white font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-none focus:outline-none min-w-[120px]"
                    placeholder="PRESS ENTER"
                  />
                ) : (
                  <button 
                    onClick={() => setIsAddingProject(true)}
                    className="border border-dashed border-white/20 text-white/30 font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-none hover:border-white/40 hover:text-white transition-colors duration-200"
                  >
                    + ADD PROJECT
                  </button>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="anim-cta w-full mt-2" style={{ transformStyle: 'preserve-3d' }}>
              <PrimaryButton
                title={isSaving ? "Saving Profile..." : "Save & Continue"}
                subtitle="Proceed To Next Step"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full !py-4 md:!py-5 !min-w-0"
              />
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Trust Line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono uppercase tracking-[0.2em] text-[10px] text-white/20 whitespace-nowrap z-10 pointer-events-none">
        YOUR PROFILE IS SAVED AND REUSED FOR EVERY MAIL YOU GENERATE
      </div>

    </div>
  );
}
