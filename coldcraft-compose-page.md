# ColdCraft — Compose Page Implementation Plan

> Route: `/compose`
> Purpose: Collect mail inputs on the left, show generated mail on the right.
> This is the highest-value screen in the app. Everything before this was setup.

---

## 0. Prerequisites

Before building this page confirm:

```
□ /api/generate-mail route is working and returning { subject, body }
□ profiles table has data for the logged-in user
□ mail_history table exists with RLS enabled
□ User cannot access /compose without being logged in (middleware protecting route)
```

---

## 1. Route Protection

Add `/compose` to your middleware matcher so unauthenticated users get redirected to `/`:

```ts
// middleware.ts
export const config = {
  matcher: [
    "/upload/:path*",
    "/onboarding/:path*",
    "/dashboard/:path*",
    "/compose/:path*",   // add this
  ],
};
```

---

## 2. Page Structure

```
/app
  /compose
    page.tsx        ← main page (server component for auth check)
    client.tsx      ← all interactive state lives here (client component)
```

Split into server + client because:
- Server component handles the initial Supabase profile fetch
- Client component handles all state (inputs, output, loading, errors)
- Avoids unnecessary client-side fetches on mount

---

## 3. Global Layout

```
NAVBAR (fixed top)
  Left:  ColdCraft wordmark
  Right: User avatar + email + SIGN OUT

MAIN CONTENT (pt-24 to clear fixed navbar)
  max-w-7xl mx-auto px-4 md:px-12 py-12
  grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start
  
  LEFT COLUMN   ← inputs
  RIGHT COLUMN  ← output
```

---

## 4. Left Column — Inputs

### 4.1 Profile Completeness Warning

Show this strip at the very top of the left column if the user's profile is missing GitHub, LinkedIn, or has fewer than 2 projects:

```
Style:
border-l-2 border-white/20 pl-4 py-2 mb-8 flex items-center justify-between

Content:
⚠ YOUR PROFILE IS INCOMPLETE — MAILS MAY BE LESS PERSONALIZED
EDIT PROFILE →  (links to /onboarding/profile)

Typography:
font-mono uppercase tracking-[0.2em] text-[10px] text-white/30
```

Do not block generation. Just inform and link.

### 4.2 Field Pattern

Every input field follows this exact pattern (same as Step 2 onboarding):

```
Label:
font-mono uppercase tracking-[0.2em] text-[10px] text-white/40 mb-1

Input:
w-full bg-white/[0.02] border border-white/10 text-white font-body
text-sm px-4 py-3 rounded-none focus:outline-none focus:border-white/40
transition-colors duration-200 placeholder:text-white/20
```

### 4.3 Fields In Order

**RECIPIENT NAME**
- Placeholder: `e.g. Priya Sharma`
- Required

**COMPANY / STARTUP**
- Placeholder: `e.g. Razorpay, Notion, Zepto`
- Required

**ROLE APPLYING FOR**
- Placeholder: `e.g. Frontend Intern, SDE-1`
- Required

**POSITION TYPE**

Two toggle pills side by side:
```
[ INTERNSHIP ]  [ FULL-TIME ]

Active pill:   bg-white text-black font-mono text-[10px] uppercase
               tracking-[0.2em] px-4 py-2 transition-all duration-200

Inactive pill: border border-white/10 text-white/40 font-mono text-[10px]
               uppercase tracking-[0.2em] px-4 py-2
               hover:border-white/30 hover:text-white/60
               transition-all duration-200

Default: INTERNSHIP selected
```

**MAIL TYPE**

Same toggle pattern:
```
[ FRESH MAIL ]  [ FOLLOW-UP ]

Default: FRESH MAIL selected
```

If FOLLOW-UP selected, show this note directly below the pills:
```
// KEEP IT UNDER 80 WORDS. REFERENCE YOUR LAST MAIL.
font-mono uppercase tracking-[0.2em] text-[10px] text-white/20 mt-2
```

**TONE**

Four pills in a 2x2 grid:
```
[ PROFESSIONAL ]  [ CASUAL ]
[ BOLD ]          [ CONCISE ]

grid grid-cols-2 gap-2
Same active/inactive styles as position type pills
Default: PROFESSIONAL selected
```

On hover each pill shows a descriptor line below it in `text-white/20`:
- PROFESSIONAL → `Clear, direct, zero fluff`
- CASUAL → `Conversational but competent`
- BOLD → `Opens with a strong claim`
- CONCISE → `Under 80 words, every word earns its place`

**WORD LIMIT**

Three fixed options as pills in a row:
```
[ 80 ]  [ 120 ]  [ 160 ]

Default: 120 selected
```

Below the pills in mono `text-white/20 text-[10px] uppercase tracking-[0.2em] mt-2`:
```
// RECRUITERS SPEND 8 SECONDS ON COLD MAILS
```

**EXTRA CONTEXT (OPTIONAL)**

```
Textarea — same border/background styling as other inputs
Rows: 3
Placeholder: ANY PROJECT TO HIGHLIGHT, REFERRAL NAME, OR CONTEXT...
Max length: 200 characters
Character counter bottom-right: font-mono text-[9px] text-white/20
  e.g. "142 / 200"
```

### 4.4 Generate Button

```tsx
<button
  onClick={handleGenerate}
  disabled={!inputs.recipient || !inputs.company || !inputs.role || loading}
  className="
    w-full bg-white text-black font-headline font-black uppercase
    tracking-tighter px-8 py-6 mt-6
    hover:scale-105 hover:bg-gray-200
    active:scale-95
    transition-all duration-300
    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
  "
>
  {loading ? "GENERATING..." : "GENERATE NOW →"}
</button>
```

Error message below button (when validation fails):
```
font-mono uppercase tracking-[0.2em] text-[10px] text-white/40 mt-3
e.g. "RECIPIENT, COMPANY, AND ROLE ARE REQUIRED."
```

---

## 5. Right Column — Output

### 5.1 Profile Context Strip

Always visible at the top of the right column, above the output zone.
Pulled from the profile prop passed from the server component:

```
GENERATING AS: RONIT MAHAJAN · MUJ · GITHUB.COM/RONITDOES

font-mono uppercase tracking-[0.2em] text-[10px] text-white/20 mb-6
```

### 5.2 Empty State (before generation)

```tsx
<div className="border border-dashed border-white/10 p-12 min-h-[400px]
                flex flex-col items-center justify-center gap-6">

  {/* Placeholder bars suggesting content */}
  <div className="w-full flex flex-col gap-3">
    <div className="bg-white/5 h-2 w-4/5" />
    <div className="bg-white/5 h-2 w-3/5" />
    <div className="bg-white/5 h-2 w-4/5" />
    <div className="bg-white/5 h-2 w-2/5" />
    <div className="bg-white/5 h-2 w-3/5" />
  </div>

  <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-white/20">
    YOUR MAIL WILL APPEAR HERE
  </p>

</div>
```

### 5.3 Loading State

Replaces the empty state zone entirely after clicking GENERATE NOW:

```tsx
<div className="border border-dashed border-white/10 p-12 min-h-[400px]
                flex flex-col items-center justify-center gap-6">

  {/* Three bouncing dots */}
  <div className="flex gap-2">
    {[0, 300, 600].map((delay, i) => (
      <div
        key={i}
        className="w-2 h-2 bg-white rounded-full animate-bounce"
        style={{ animationDelay: `${delay}ms` }}
      />
    ))}
  </div>

  {/* Cycling text */}
  <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-white/60
                transition-opacity duration-300">
    {loadingTexts[loadingTextIndex]}
  </p>

</div>
```

Loading texts that cycle every 1200ms:
```
"CRAFTING YOUR SUBJECT LINE..."
"WRITING YOUR OPENING..."
"PERSONALIZING YOUR MAIL..."
"ALMOST READY..."
```

### 5.4 Generated State

Replaces the loading zone after response arrives:

```tsx
<div className="flex flex-col gap-6">

  {/* Subject */}
  <div>
    <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-white/30 mb-2">
      SUBJECT
    </p>
    <div className="border-t border-white/10 pt-4">
      <p className="font-headline font-black uppercase text-lg tracking-tighter text-white">
        {output.subject}
      </p>
    </div>
  </div>

  {/* Body */}
  <div>
    <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-white/30 mb-2">
      MAIL BODY
    </p>
    <div className="border-t border-white/10 pt-4">
      <p className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
        {output.body}
      </p>
    </div>
  </div>

  {/* Action buttons */}
  <div className="flex gap-3 pt-4 border-t border-white/5">
    <button onClick={handleCopy}>
      {copied ? "COPIED ✓" : "COPY"}
    </button>
    <button onClick={handleGmailOpen}>
      OPEN IN GMAIL
    </button>
    <button onClick={handleRegenerate}>
      REGENERATE
    </button>
  </div>

</div>
```

Action button shared style:
```
font-mono uppercase tracking-[0.2em] text-[10px]
border border-white/10 px-4 py-2
text-white/40
hover:border-white/40 hover:text-white
transition-colors duration-200
```

---

## 6. State Management

```ts
// Inputs
const [inputs, setInputs] = useState({
  recipient: "",
  company: "",
  role: "",
  positionType: "internship",   // "internship" | "full-time"
  mailType: "fresh",            // "fresh" | "follow-up"
  tone: "professional",         // "professional" | "casual" | "bold" | "concise"
  wordLimit: 120,               // 80 | 120 | 160
  extraContext: "",
});

// Output
const [output, setOutput] = useState({ subject: "", body: "" });

// UI states
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [copied, setCopied] = useState(false);
const [loadingTextIndex, setLoadingTextIndex] = useState(0);

// Screen state
type Screen = "empty" | "loading" | "generated";
const [screen, setScreen] = useState<Screen>("empty");
```

---

## 7. Core Handlers

```ts
// Generate
const handleGenerate = async () => {
  if (!inputs.recipient || !inputs.company || !inputs.role) {
    setError("RECIPIENT, COMPANY, AND ROLE ARE REQUIRED.");
    return;
  }
  setError("");
  setLoading(true);
  setScreen("loading");

  try {
    const res = await fetch("/api/generate-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "GENERATION FAILED. TRY AGAIN.");
      setScreen("empty");
      return;
    }
    setOutput({ subject: data.subject, body: data.body });
    setScreen("generated");
  } catch {
    setError("NETWORK ERROR. CHECK YOUR CONNECTION.");
    setScreen("empty");
  } finally {
    setLoading(false);
  }
};

// Copy
const handleCopy = async () => {
  const full = `Subject: ${output.subject}\n\n${output.body}`;
  await navigator.clipboard.writeText(full);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

// Open in Gmail
const handleGmailOpen = () => {
  const url = `https://mail.google.com/mail/?view=cm&su=${encodeURIComponent(output.subject)}&body=${encodeURIComponent(output.body)}`;
  window.open(url, "_blank");
};

// Regenerate — same inputs, slightly higher temperature handled server-side
const handleRegenerate = () => {
  handleGenerate();
};

// Loading text cycle
useEffect(() => {
  if (!loading) return;
  const interval = setInterval(() => {
    setLoadingTextIndex(i => (i + 1) % loadingTexts.length);
  }, 1200);
  return () => clearInterval(interval);
}, [loading]);
```

---

## 8. Pre-fill from Dashboard RESEND

When user clicks RESEND on a dashboard history item, they land on `/compose` with query params. Read them on mount and pre-fill inputs:

```ts
// In compose/page.tsx (server component)
// Pass searchParams as props to client component

// In client.tsx
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
```

---

## 9. GSAP Entrance Animation

On mount, stagger in the left column inputs and right column output zone:

```ts
useEffect(() => {
  gsap.fromTo(
    [".anim-left", ".anim-right"],
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power4.out",
    }
  );
}, []);
```

Assign `.anim-left` to the left column wrapper and `.anim-right` to the right column wrapper.

No rotateX here — this is a dashboard-level page, not onboarding. Simple fade-up is more appropriate.

---

## 10. Validation Rules

| Field | Rule |
|-------|------|
| Recipient name | Required, min 2 chars |
| Company | Required, min 2 chars |
| Role | Required, min 3 chars |
| Position type | Required, defaults to internship |
| Mail type | Required, defaults to fresh |
| Tone | Required, defaults to professional |
| Word limit | Required, defaults to 120 |
| Extra context | Optional, max 200 chars |

Show all validation errors as mono uppercase text below the generate button. Never block the UI with a modal.

---

## 11. Verification Checklist

```
Layout
□ Two-column layout renders correctly on desktop
□ Stacks to single column on mobile
□ Navbar is fixed and does not overlap content
□ Profile context strip shows correct user data

Inputs
□ All three required fields show error when empty and generate is clicked
□ Position type pills are mutually exclusive
□ Mail type pills are mutually exclusive
□ Tone pills are mutually exclusive (only one active at a time)
□ Word limit pills are mutually exclusive
□ FOLLOW-UP note appears when follow-up is selected
□ Character counter updates on extra context input
□ Generate button is disabled when required fields are empty

Generation
□ Loading state shows immediately after clicking GENERATE NOW
□ Loading text cycles through all four strings
□ Generated mail renders subject and body correctly
□ Error message appears in mono style when generation fails

Actions
□ COPY copies "Subject: ...\n\n<body>" to clipboard
□ COPY button text flips to "COPIED ✓" for 2 seconds
□ OPEN IN GMAIL opens Gmail compose with subject and body pre-filled
□ REGENERATE calls generation again with same inputs
□ New generation replaces the previous output correctly

RESEND flow
□ Landing on /compose?recipient=X&company=Y pre-fills all matching fields
□ User can generate immediately without re-entering any data

Profile warning
□ Warning strip appears when profile is incomplete
□ EDIT PROFILE link goes to /onboarding/profile
□ Warning does not appear when profile is complete
```

---

## 12. Do's and Don'ts

**DO:**
- Keep the output zone exactly the same height in all three states (empty / loading / generated) to prevent layout shift
- Disable the generate button while loading — never allow double submission
- Show the profile context strip even during loading and after generation
- Use `whitespace-pre-wrap` on the mail body so line breaks from the AI render correctly
- Test REGENERATE multiple times — output should vary slightly each time

**DON'T:**
- Add a save draft button in v1 — mail saves automatically via the API route
- Add a word count on the output — unnecessary noise
- Use a modal or drawer for the generated mail — it lives inline in the right column
- Allow the generate button to fire when required fields are empty
- Add a back button — the navbar logo handles navigation

---

*Last updated: May 2026 — ColdCraft v1*
