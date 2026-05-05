import { groq } from "@/lib/groq";
import { MAIL_GENERATION_PROMPT } from "@/lib/prompts";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {

  // 1. Auth check — never trust the client
  const supabase = await createClient();
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
