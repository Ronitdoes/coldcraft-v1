# ColdCraft — Project Context

> Single source of truth for any developer or AI continuing work on this project.

---

## 1. Project Overview

**ColdCraft** is an AI-powered cold email generator designed for Indian engineering students applying for internships and full-time positions at startups and tech companies.

### Core Purpose

Users upload their resume → the system extracts structured profile data → users compose cold emails by specifying a recipient, company, role, and tone → the AI generates a sharp, personalized cold email using the candidate's real projects and skills.

### Target Users

- Indian engineering/CS students (2nd–4th year B.Tech)
- Applying for internships or full-time roles at startups and tech companies

### Key Features

| Feature | Description |
|---|---|
| **Google OAuth** | One-click sign-in via Supabase Auth |
| **Resume Parsing** | Upload PDF → extract text → Groq LLM structures data into profile fields |
| **Resume Storage** | Original PDF stored in Supabase Storage for re-parsing later |
| **Profile Management** | Editable profile with name, college, GitHub, LinkedIn, skills, projects |
| **AI Mail Composer** | Select recipient/company/role/tone → generates cold email via Groq |
| **Mail History** | All generated emails are saved and browsable from the dashboard |
| **Resend** | Re-open the composer pre-filled with a previous email's parameters |

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| Language | TypeScript | ^5 |
| React | React | 19.2.4 |
| Styling | Tailwind CSS | v4 |
| Animations | GSAP + `@gsap/react` | ^3.15.0 |
| Smooth Scrolling | Lenis | ^1.3.23 |
| Auth + DB + Storage | Supabase (`@supabase/ssr`) | ^0.10.2 |
| AI (LLM) | Groq SDK (`groq-sdk`) | ^1.1.2 |
| PDF Extraction | `unpdf` | ^1.6.2 |
| Icons | Google Material Symbols (CDN) | — |

### Key Notes

- **No `pdfjs-dist` or `pdf-parse`** — both were tried and removed due to incompatibilities with Next.js Turbopack and Node.js worker requirements. `unpdf` is the working solution for server-side PDF text extraction.
- **Groq, not OpenAI** — all AI calls go through Groq's API, which hosts open-source LLaMA models with very fast inference.

---

## 3. Supabase Integration

Supabase is the sole backend. There is no custom server, no Express, no separate database.

### What Supabase Provides

| Service | Usage |
|---|---|
| **Authentication** | Google OAuth sign-in |
| **Database (Postgres)** | `profiles` and `mail_history` tables |
| **Storage** | `resumes` bucket for uploaded PDFs |
| **RLS (Row Level Security)** | Enabled on all tables and storage buckets |

### Supabase Project

- **Project URL**: `https://ezviorivmtxsrynwlpdm.supabase.co`
- **Project ID**: `ezviorivmtxsrynwlpdm`

> ⚠️ The project ID is baked into the URL and anon key. It cannot be changed without reconfiguring the entire frontend and environment.

### Authentication Flow

1. User clicks "Continue with Google" on `/login`
2. `supabase.auth.signInWithOAuth({ provider: "google" })` redirects to Google
3. Google redirects back to `/auth/callback` with an authorization `code`
4. The callback route exchanges the code for a session via `supabase.auth.exchangeCodeForSession(code)`
5. Session cookies are set automatically by `@supabase/ssr`
6. User is redirected to `/` (home)

### Supabase Clients

| File | Context | Usage |
|---|---|---|
| `utils/supabase/client.ts` | Client components (`"use client"`) | `createBrowserClient()` — reads cookies from the browser |
| `utils/supabase/server.ts` | Server components + API routes | `createServerClient()` — reads cookies from `next/headers` |

### User Data Access

```ts
// Get the authenticated user (server-side)
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
// user.id, user.email, user.user_metadata.full_name, user.user_metadata.avatar_url
```

### Database Schema

#### `profiles` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | References `auth.users.id` |
| `name` | `text` | Full name from resume |
| `email` | `text` | From auth |
| `college` | `text` | |
| `year` | `text` | e.g. "2nd Year B.Tech CSE" |
| `github` | `text` | |
| `linkedin` | `text` | |
| `portfolio` | `text` | |
| `skills` | `text[]` | Array, max 8 |
| `projects` | `text[]` | Array, max 5 |
| `updated_at` | `timestamp` | Defaults to `now()` |

> ⚠️ **CRITICAL**: Column names are short — `name`, `year`, `github`, `linkedin`. NOT `full_name`, `year_of_study`, `github_url`, `linkedin_url`. This has caused bugs before. Always verify against the actual schema.

#### `mail_history` table

| Column | Type |
|---|---|
| `id` | `uuid` (PK, auto-generated) |
| `user_id` | `uuid` (FK → `auth.users.id`) |
| `recipient` | `text` |
| `company` | `text` |
| `role` | `text` |
| `tone` | `text` |
| `mail_type` | `text` (`"fresh"` or `"follow-up"`) |
| `position_type` | `text` (`"internship"` or `"full-time"`) |
| `word_limit` | `integer` |
| `extra_context` | `text` (nullable) |
| `subject` | `text` |
| `body` | `text` |
| `created_at` | `timestamp` |

### Storage

- **Bucket**: `resumes` (private, RLS enabled)
- **Path pattern**: `{user_id}/resume.pdf`
- **Upload uses `upsert: true`** so re-uploading overwrites the old file
- **RLS policies**: Users can only upload/read/update files in their own `{user_id}/` folder

---

## 4. Project Structure

```
coldapril/
├── app/
│   ├── layout.tsx              # Root layout (fonts, SmoothScroll, CustomScrollbar)
│   ├── page.tsx                # Landing page (Hero, SpeakerGrid, BentoStats, etc.)
│   ├── globals.css             # Tailwind v4 @theme tokens, design system
│   ├── login/page.tsx          # Google OAuth login page
│   ├── auth/callback/route.ts  # OAuth callback — exchanges code for session
│   ├── onboarding/
│   │   ├── resume/page.tsx     # Step 1: Upload resume PDF
│   │   └── profile/page.tsx    # Step 2: Review/edit extracted profile data
│   ├── dashboard/page.tsx      # Mail history, stats, user menu
│   ├── compose/
│   │   ├── page.tsx            # Server component — auth guard + profile check
│   │   └── client.tsx          # Client component — the actual composer form
│   └── api/
│       ├── parse-resume/route.ts   # POST: Upload PDF → extract text → Groq → save profile
│       └── generate-mail/route.ts  # POST: Compose inputs → Groq → save to mail_history
├── components/
│   ├── NavBar.tsx              # Top navigation bar
│   ├── Hero.tsx                # Landing page hero section
│   ├── BentoStats.tsx          # Bento-grid stats section
│   ├── SpeakerGrid.tsx         # Feature showcase grid
│   ├── JoinCore.tsx            # CTA section
│   ├── Footer.tsx              # Site footer
│   ├── Logo.tsx                # SVG logo component
│   ├── TextRollover.tsx        # Character-by-character text animation
│   ├── Marquee.tsx             # Scrolling text marquee
│   ├── EmailFlowAnimation.tsx  # Animated email flow visualization
│   ├── GetOverlaySVG.tsx       # Decorative SVG overlay
│   ├── CustomScrollbar.tsx     # Custom scrollbar (replaces native)
│   ├── SmoothScroll.tsx        # Lenis smooth scroll wrapper
│   └── ui/
│       └── PrimaryButton.tsx   # Reusable CTA button with TextRollover
├── lib/
│   ├── groq.ts                 # Groq SDK client initialization
│   ├── gsap.ts                 # GSAP + plugins registration (centralized)
│   └── prompts.ts              # AI system prompts (MAIL_GENERATION_PROMPT, RESUME_PARSE_PROMPT)
├── utils/supabase/
│   ├── client.ts               # Browser-side Supabase client
│   └── server.ts               # Server-side Supabase client (uses cookies)
├── middleware.ts                # Route matcher for protected paths (placeholder logic)
├── .env.local                  # Environment variables (not committed)
├── next.config.ts              # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## 5. UI/UX Design System

### Design Language

- **Dark, minimal, brutalist-editorial** — black backgrounds, white/gray typography, zero border-radius
- **Monochromatic palette** — grays from `#0e0e0e` to `#e2e2e2`, no bright accent colors
- All border-radius is `0px` by default (sharp corners everywhere)

### Typography

| Token | Font | Usage |
|---|---|---|
| `--font-headline` | Space Grotesk | Headings, hero text, buttons |
| `--font-body` | Inter | Body text, labels, form fields |
| `--font-caveat` | Caveat | Handwritten accents (variable loaded, sparingly used) |

- Headings use `font-headline font-black` with tight tracking (`kerning-tight` = `-0.04em`)
- Labels use `font-mono uppercase tracking-[0.25em] text-[11px]`

### Spacing & Layout

- Max content width: `max-w-7xl` (1280px)
- Horizontal padding: `px-4 md:px-12`
- The landing page uses a 12-column editorial grid (`.editorial-grid`)
- Onboarding pages use a two-column split layout (left: large step number + heading, right: form)

### Component Patterns

- **Buttons**: Large, white `bg-white text-black`, with `hover:scale-110` and `TextRollover` micro-animations
- **Inputs**: `bg-white/[0.02] border border-white/20 text-white rounded-none` — transparent glass effect
- **Chips/Tags**: Skills and projects rendered as removable chips with `×` buttons
- **Animations**: Every page uses `useGSAP` for staggered entrance animations (`rotateX`, `opacity`, `y` transforms)

### Scrollbar

- Native scrollbar is hidden globally via CSS (`::-webkit-scrollbar { display: none }`)
- Replaced with `CustomScrollbar.tsx` — a custom floating indicator

### Smooth Scrolling

- `SmoothScroll.tsx` wraps all children in a Lenis instance
- Provides buttery scroll on all pages

---

## 6. Authentication Flow

```
User clicks "Write My Cold Mail" (Hero CTA)
    │
    ├─ Not logged in → redirect to /login
    │       │
    │       └─ Click "Continue with Google"
    │               │
    │               └─ Google OAuth → /auth/callback
    │                       │
    │                       └─ Session created → redirect to /
    │
    └─ Logged in → redirect to /compose
            │
            ├─ Has profile? → Show composer
            │
            └─ No profile? → redirect to /onboarding/resume
```

### Protected Routes

The middleware matcher covers `/onboarding/*`, `/dashboard/*`, `/compose/*` but currently only calls `NextResponse.next()` (placeholder). Actual auth guards are implemented per-page:

- **`/compose/page.tsx`** (server component): Checks `supabase.auth.getUser()`, redirects to `/login` if no user, redirects to `/onboarding/resume` if no profile.
- **`/dashboard/page.tsx`** (client component): Fetches user client-side, shows loading state.

---

## 7. Onboarding Flow

### Step 1: Resume Upload (`/onboarding/resume`)

1. User drags/drops or selects a PDF file
2. Frontend sends `FormData` with the file to `POST /api/parse-resume`
3. API route:
   - Authenticates the user server-side
   - Uploads the PDF to Supabase Storage (`resumes/{user_id}/resume.pdf`)
   - Extracts text using `unpdf`
   - Sends text to Groq `llama-3.1-8b-instant` with `RESUME_PARSE_PROMPT`
   - Parses the JSON response
   - Upserts the extracted data into the `profiles` table
4. On success, frontend redirects to `/onboarding/profile`

### Step 2: Profile Review (`/onboarding/profile`)

1. Page fetches the user's profile from Supabase on mount
2. All fields are pre-filled with the parsed data
3. User can edit any field, add/remove skills and projects
4. Clicking "Save & Continue" upserts to `profiles` and redirects to `/dashboard`

### AI Models Used

| Task | Model | Provider |
|---|---|---|
| Resume parsing | `llama-3.1-8b-instant` | Groq |
| Email generation | `llama-3.3-70b-versatile` | Groq |

---

## 8. Dashboard (`/dashboard`)

### What It Shows

- **User greeting** with avatar and name from `user.user_metadata`
- **Stats bar**: Total mails generated, unique companies, unique roles
- **Mail history list**: Expandable cards showing each generated email with subject, body, recipient, company, and tone
- **Resend button**: Opens `/compose` pre-filled with the original email's parameters (recipient, company, role, tone, etc.)
- **User dropdown**: Profile info, logout button

### Data Fetching

- Client-side: fetches user via `supabase.auth.getUser()`
- Fetches profile from `profiles` table
- Fetches mail history from `mail_history` table, ordered by `created_at DESC`

---

## 9. Email Composer (`/compose`)

### Architecture

- `page.tsx` is a **server component** that handles auth + profile checks
- `client.tsx` is a **client component** that receives `profile` as a prop and renders the form

### Composer Inputs

| Field | Type | Options |
|---|---|---|
| Recipient Name | text | — |
| Company | text | — |
| Role | text | — |
| Position Type | select | `internship`, `full-time` |
| Mail Type | select | `fresh`, `follow-up` |
| Tone | select | `professional`, `casual`, `bold`, `concise` |
| Word Limit | number | Default: 120 |
| Extra Context | textarea | Optional |

### Generation Flow

1. Client POSTs to `/api/generate-mail` with all fields
2. API fetches the user's profile from DB
3. Builds a detailed prompt with candidate info + target info
4. Calls Groq `llama-3.3-70b-versatile`
5. Parses `SUBJECT:` line and body from output
6. Saves to `mail_history` table
7. Returns `{ subject, body }` to the client
8. Client displays the generated email with copy-to-clipboard functionality

### Tone Temperature Mapping

```ts
{ professional: 0.5, concise: 0.4, casual: 0.8, bold: 0.85 }
```

---

## 10. Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ezviorivmtxsrynwlpdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Groq AI
GROQ_API_KEY=<your-groq-api-key>
```

| Variable | Public? | Used By |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client + server Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client + server Supabase clients |
| `GROQ_API_KEY` | **No** (server only) | `lib/groq.ts` — API routes only |

---

## 11. Known Issues & TODOs

### Known Issues

- **Dashboard `Profile` type** uses stale field names (`full_name`, `year_of_study`, etc.) — the actual DB columns are `name`, `year`, `github`, `linkedin`. The type definition at the top of `dashboard/page.tsx` needs updating.
- **Middleware is a no-op** — it matches protected routes but doesn't actually check auth. Auth guards are implemented per-page instead.
- **Some `any` types remain** in the dashboard (e.g., `user` state) — should be replaced with proper interfaces.

### TODOs

- [ ] Fix the `Profile` type in `dashboard/page.tsx` to match actual DB schema
- [ ] Implement real auth checking in `middleware.ts`
- [ ] Add error boundaries for API failures in the composer
- [ ] Add a "re-parse resume" feature from the dashboard (PDF is already stored in Supabase)
- [ ] Add email copy-to-clipboard confirmation toast
- [ ] Mobile responsiveness pass on the onboarding profile page layout

---

## 12. How to Run

### Prerequisites

- Node.js 18+
- A Supabase project with Google OAuth configured
- A Groq API key

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → Opens at http://localhost:3000

# Production build
npm run build
npm start
```

### Supabase Setup (if starting fresh)

1. Create a Supabase project
2. Enable Google OAuth in Authentication → Providers
3. Set the callback URL to `http://localhost:3000/auth/callback`
4. Create the `profiles` and `mail_history` tables (schema above)
5. Create a `resumes` storage bucket (private)
6. Enable RLS on all tables and buckets
7. Add environment variables to `.env.local`

---

*Last updated: 2026-05-05*
