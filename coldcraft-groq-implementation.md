# ColdCraft — Groq Llama 3.3 70B Implementation Plan

> Build order: Tables → Groq Client → Prompts → Parse Resume Route → Generate Mail Route → Composer UI → Dashboard Resend
> Do not touch UI until both API routes return correct responses when tested with raw fetch.

---

## 0. Prerequisites

| Item | Detail |
|------|--------|
| API Key | Get from console.groq.com → API Keys → Create new key |
| Generation model | `llama-3.3-70b-versatile` |
| Parsing model | `llama-3.1-8b-instant` |
| Install | `npm install groq-sdk` |
| Env var | `GROQ_API_KEY=gsk_your_key_here` in `.env.local` |

**Rule:** Never expose `GROQ_API_KEY` on the client side. All Groq calls go through API routes only.

---

## 1. File Structure

```
/app
  /api
    /generate-mail
      route.ts          ← main generation endpoint
    /parse-resume
      route.ts          ← resume extraction endpoint
  /compose
    page.tsx            ← composer UI
  /dashboard
    page.tsx            ← history + resend
/lib
  groq.ts               ← Groq client singleton
  prompts.ts            ← all system prompts
```

---

## 2. Supabase Tables

Run in Supabase SQL editor first before writing any code.

```sql
-- Profiles table
create table profiles (
  id uuid references auth.users primary key,
  name text,
  email text,
  college text,
  year text,
  github text,
  linkedin text,
  portfolio text,
  skills text[],
  projects text[],
  updated_at timestamp default now()
);

-- Mail history table
create table mail_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  recipient text,
  company text,
  role text,
  tone text,
  mail_type text,
  position_type text,
  word_limit integer,
  extra_context text,
  subject text,
  body text,
  created_at timestamp default now()
);

-- Row level security
alter table profiles enable row level security;
alter table mail_history enable row level security;

create policy "Users manage own profile"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users manage own mail history"
  on mail_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## 3. Groq Client

**`/lib/groq.ts`**

```ts
import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
```

This is a singleton. Import `groq` from here everywhere. Never reinstantiate it.

---

## 4. Prompts

**`/lib/prompts.ts`**

```ts
export const MAIL_GENERATION_PROMPT = `
You are ColdCraft — an AI that writes cold emails for Indian engineering 
students applying for internships and full-time jobs at startups and 
tech companies.

RULES — FOLLOW EVERY SINGLE ONE:
1. Keep the mail under the specified word limit. Recruiters do not read long mails.
2. NEVER open with: "I hope this email finds you well", "I am writing to 
   express my interest", "My name is", or any generic opener whatsoever.
3. Open with something specific and sharp about the company or the role. 
   Not about the candidate. Make the recruiter feel seen.
4. Mention exactly 1 or 2 projects from the candidate profile. 
   Never more than 2. Never just list technologies.
5. End with ONE clear ask — a 15 minute call OR a portfolio link. 
   Never both. Never "looking forward to hearing from you."
6. Sound like a sharp, confident 20-year-old who knows their worth. 
   Not a corporate robot. Not overly eager.
7. No bullet points inside the mail body. Prose only.
8. Subject line must be under 8 words. Hyper-specific to the role and company.
9. Never use: "passionate", "keen", "eager", "excited", or "leverage".
10. If FOLLOW-UP: reference that no response was received. 
    Under 80 words total. Even more direct than a fresh mail.

TONE RULES:
- PROFESSIONAL: Formal but not stiff. Clear, direct, zero fluff.
- CASUAL: Contractions allowed. Shorter sentences. Still competent.
- BOLD: Open with a strong claim or a result from one of their projects.
- CONCISE: Every word earns its place. Max 80 words. No filler sentences.

OUTPUT — RETURN ONLY THIS. NO EXTRA TEXT. NO MARKDOWN. NO BACKTICKS:

SUBJECT: <subject line here>

<mail body here>
`;

export const RESUME_PARSE_PROMPT = `
You are a resume data extractor. Extract structured data and return 
ONLY valid JSON. No explanation. No markdown. No backticks. Raw JSON only.

Return exactly this schema:
{
  "name": "string",
  "email": "string",
  "college": "string",
  "year": "string",
  "github": "string",
  "linkedin": "string",
  "portfolio": "string",
  "skills": ["string"],
  "projects": ["string"]
}

Rules:
- skills: max 8 most relevant technical skills
- projects: max 5 project names only, no descriptions
- If a field is not found use "" for strings and [] for arrays
- year: format as "2nd Year B.Tech CSE" or similar
`;
```

---

## 5. Resume Parsing Route

**`/app/api/parse-resume/route.ts`**

```ts
import { groq } from "@/lib/groq";
import { RESUME_PARSE_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  const { resumeText } = await req.json();

  if (!resumeText || resumeText.length < 50) {
    return Response.json(
      { error: "Resume text too short or empty" },
      { status: 400 }
    );
  }

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: RESUME_PARSE_PROMPT },
        { role: "user", content: `Extract from this resume:\n\n${resumeText}` },
      ],
      temperature: 0.1,
      max_tokens: 500,
    });
  } catch (err) {
    console.error("Groq parse error:", err);
    return Response.json({ error: "Parsing failed" }, { status: 500 });
  }

  try {
    const raw = completion.choices[0].message.content ?? "{}";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json({ data: parsed });
  } catch {
    return Response.json(
      { error: "Invalid JSON from parser. Try again." },
      { status: 500 }
    );
  }
}
```

> **Why `llama-3.1-8b-instant` here?** Faster and cheaper for structured extraction. Save the 70B model for generation where quality matters most.

---

## 6. Mail Generation Route

**`/app/api/generate-mail/route.ts`**

```ts
import { groq } from "@/lib/groq";
import { MAIL_GENERATION_PROMPT } from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {

  // 1. Auth check — never trust the client
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Pull composer inputs
  const {
    recipient,
    company,
    role,
    positionType,
    mailType,
    tone,
    wordLimit,
    extraContext,
  } = await req.json();

  // 3. Validate required fields
  if (!recipient || !company || !role) {
    return Response.json(
      { error: "recipient, company, and role are required" },
      { status: 400 }
    );
  }

  // 4. Fetch user profile from Supabase
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name, college, year, github, linkedin, portfolio, skills, projects")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return Response.json(
      { error: "Profile not found. Complete onboarding first." },
      { status: 404 }
    );
  }

  // 5. Build user message
  const userMessage = `
Write a ${mailType === "follow-up" ? "follow-up" : "fresh"} cold email
for a ${positionType} position.

WORD LIMIT: ${wordLimit} words maximum for the mail body.
TONE: ${tone.toUpperCase()}

CANDIDATE PROFILE:
- Name: ${profile.name}
- College: ${profile.college}, ${profile.year}
- GitHub: ${profile.github || "not provided"}
- LinkedIn: ${profile.linkedin || "not provided"}
- Portfolio: ${profile.portfolio || "not provided"}
- Top Projects: ${profile.projects?.slice(0, 5).join(", ") || "not provided"}
- Top Skills: ${profile.skills?.slice(0, 8).join(", ") || "not provided"}
${extraContext ? `- Extra context: ${extraContext}` : ""}

MAIL TARGET:
- Recipient name: ${recipient}
- Company: ${company}
- Role: ${role}
- Position type: ${positionType}
`;

  // 6. Call Groq
  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: MAIL_GENERATION_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: getToneTemperature(tone),
      max_tokens: 600,
    });
  } catch (err) {
    console.error("Groq error:", err);
    return Response.json(
      { error: "Generation failed. Try again." },
      { status: 500 }
    );
  }

  const output = completion.choices[0].message.content ?? "";

  // 7. Parse subject and body
  const lines = output.split("\n");
  const subjectLine = lines.find(l => l.startsWith("SUBJECT:"));
  const subject = subjectLine?.replace("SUBJECT:", "").trim() ?? "";
  const body = lines
    .filter(l => !l.startsWith("SUBJECT:"))
    .join("\n")
    .trim();

  if (!subject || !body) {
    return Response.json(
      { error: "Malformed output. Try regenerating." },
      { status: 500 }
    );
  }

  // 8. Save to mail_history
  const { error: insertError } = await supabase
    .from("mail_history")
    .insert({
      user_id: user.id,
      recipient,
      company,
      role,
      tone,
      mail_type: mailType,
      position_type: positionType,
      word_limit: wordLimit,
      extra_context: extraContext ?? null,
      subject,
      body,
    });

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    // Do not fail the request — return the mail even if save fails
  }

  // 9. Return to frontend
  return Response.json({ subject, body });
}

function getToneTemperature(tone: string): number {
  const map: Record<string, number> = {
    professional: 0.5,
    concise: 0.4,
    casual: 0.8,
    bold: 0.85,
  };
  return map[tone] ?? 0.6;
}
```

---

## 7. Composer Frontend — Key Logic

**`/app/compose/page.tsx`**

```ts
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ComposePage() {
  const searchParams = useSearchParams();

  // Pre-fill from dashboard RESEND
  const [inputs, setInputs] = useState({
    recipient: searchParams.get("recipient") ?? "",
    company: searchParams.get("company") ?? "",
    role: searchParams.get("role") ?? "",
    positionType: searchParams.get("positionType") ?? "internship",
    mailType: searchParams.get("mailType") ?? "fresh",
    tone: searchParams.get("tone") ?? "professional",
    wordLimit: Number(searchParams.get("wordLimit")) || 120,
    extraContext: "",
  });

  const [output, setOutput] = useState({ subject: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingTexts = [
    "CRAFTING YOUR SUBJECT LINE...",
    "WRITING YOUR OPENING...",
    "PERSONALIZING YOUR MAIL...",
    "ALMOST READY...",
  ];

  // Cycle loading text while generating
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingTextIndex(i => (i + 1) % loadingTexts.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    if (!inputs.recipient || !inputs.company || !inputs.role) {
      setError("RECIPIENT, COMPANY, AND ROLE ARE REQUIRED.");
      return;
    }
    setLoading(true);
    setError("");
    setOutput({ subject: "", body: "" });

    try {
      const res = await fetch("/api/generate-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "GENERATION FAILED. TRY AGAIN.");
        return;
      }
      setOutput({ subject: data.subject, body: data.body });
    } catch {
      setError("NETWORK ERROR. CHECK YOUR CONNECTION.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const full = `Subject: ${output.subject}\n\n${output.body}`;
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGmailOpen = () => {
    const gmail = `https://mail.google.com/mail/?view=cm&su=${encodeURIComponent(output.subject)}&body=${encodeURIComponent(output.body)}`;
    window.open(gmail, "_blank");
  };
}
```

---

## 8. Dashboard Resend Logic

**`/app/dashboard/page.tsx`** — resend handler:

```ts
const handleResend = (mail: MailHistory) => {
  const params = new URLSearchParams({
    recipient: mail.recipient,
    company: mail.company,
    role: mail.role,
    positionType: mail.position_type,
    mailType: mail.mail_type,
    tone: mail.tone,
    wordLimit: String(mail.word_limit),
  });
  router.push(`/compose?${params.toString()}`);
};
```

---

## 9. Temperature Reference

| Tone | Temperature | Why |
|------|-------------|-----|
| CONCISE | 0.4 | Most predictable, tightest output |
| PROFESSIONAL | 0.5 | Structured, minimal variation |
| CASUAL | 0.8 | More natural, varied sentence structure |
| BOLD | 0.85 | Creative opener, harder hitting |

Never go above 0.9 — output becomes unreliable for email generation.

---

## 10. Complete Data Flow

```
User opens /compose
  → fills recipient, company, role, tone, type, word limit
  → clicks GENERATE NOW
    → POST /api/generate-mail
      → Supabase auth check → 401 if not logged in
      → fetch profile from profiles table → 404 if missing
      → validate required fields → 400 if missing
      → build system prompt + user message
      → call Groq llama-3.3-70b-versatile
      → parse SUBJECT + body from output
      → insert row into mail_history
      → return { subject, body }
    → output renders in right column
    → user copies or opens Gmail
  → dashboard THE ARCHIVE shows new entry
  → RESEND pre-fills composer with original inputs
```

---

## 11. Verification Checklist

Work through this in order. Do not move to the next item until the current one passes.

```
Setup
□ GROQ_API_KEY added to .env.local
□ npm install groq-sdk ran successfully
□ Supabase tables created (profiles + mail_history)
□ RLS policies enabled on both tables

API Routes
□ POST /api/parse-resume returns valid JSON from real resume text
□ POST /api/generate-mail returns { subject, body } for valid inputs
□ Unauthorized request to /api/generate-mail returns 401
□ Missing required fields returns 400 with specific message
□ Empty profile returns 404 with "Complete onboarding first"

Database
□ Generated mail appears in mail_history table in Supabase
□ Profile data saves correctly from Step 2 onboarding

Frontend
□ Dashboard THE ARCHIVE shows new mail after generation
□ RESEND pre-fills composer correctly with all original inputs
□ COPY button copies subject + body to clipboard
□ COPY button text flips to "COPIED" for 2 seconds then resets
□ OPEN IN GMAIL opens Gmail compose with subject + body pre-filled
□ REGENERATE calls generation again with same inputs
□ Loading text cycles correctly while generating
□ Error states display in mono uppercase style matching design system
```

---

## 12. Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Session expired or missing | Redirect to `/auth` |
| 404 Profile not found | User skipped onboarding | Redirect to `/onboarding/resume` |
| Malformed output | Model returned unexpected format | Add retry logic, lower temperature |
| JSON parse error in resume | Model added markdown fences | `.replace(/\`\`\`json\|\`\`\`/g, "")` before parsing |
| Supabase insert error | RLS policy blocking | Check `auth.uid() = user_id` policy |
| GROQ_API_KEY undefined | Not in `.env.local` or wrong var name | Verify exact spelling in both files |

---

*Last updated: May 2026 — ColdCraft v1*
