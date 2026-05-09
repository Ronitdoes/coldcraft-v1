import { groq } from "@/lib/groq";
import { MAIL_GENERATION_PROMPT } from "@/lib/prompts";
import { consumeRateLimit, requireAllowedOrigin, trimText } from "@/lib/security";
import { createClient } from "@/utils/supabase/server";

const POSITION_TYPES = new Set(["internship", "full-time"]);
const MAIL_TYPES = new Set(["fresh", "follow-up"]);
const TONES = new Set(["professional", "casual", "bold", "concise"]);
const WORD_LIMITS = new Set([80, 120, 160]);

type GenerateMailInput = {
  recipient: string;
  company: string;
  role: string;
  positionType: "internship" | "full-time";
  mailType: "fresh" | "follow-up";
  tone: "professional" | "casual" | "bold" | "concise";
  wordLimit: 80 | 120 | 160;
  extraContext: string;
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Please log in before generating an email." }, { status: 401 });
  }

  const originError = requireAllowedOrigin(req);
  if (originError) return originError;

  const rateLimitError = await consumeRateLimit(user.id, "generate-mail");
  if (rateLimitError) return rateLimitError;

  let rawInput: unknown;
  try {
    rawInput = await req.json();
  } catch {
    return Response.json({ error: "Something was wrong with the request. Please refresh and try again." }, { status: 400 });
  }

  const input = validateGenerateMailInput(rawInput);
  if ("error" in input) {
    return Response.json({ error: input.error }, { status: 400 });
  }

  const {
    recipient,
    company,
    role,
    positionType,
    mailType,
    tone,
    wordLimit,
    extraContext,
  } = input;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name, college, year, github, linkedin, portfolio, skills, projects")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return Response.json(
      { error: "Please complete your profile before generating an email." },
      { status: 404 }
    );
  }

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
      { error: "We could not generate your email right now. Please try again." },
      { status: 500 }
    );
  }

  const output = completion.choices[0].message.content ?? "";
  const lines = output.split("\n");
  const subjectLine = lines.find((line) => line.startsWith("SUBJECT:"));
  const subject = subjectLine?.replace("SUBJECT:", "").trim() ?? "";
  const body = lines
    .filter((line) => !line.startsWith("SUBJECT:"))
    .join("\n")
    .trim();

  if (!subject || !body) {
    return Response.json(
      { error: "The generated email was incomplete. Please try regenerating it." },
      { status: 500 }
    );
  }

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
      extra_context: extraContext || null,
      subject,
      body,
    });

  if (insertError) {
    console.error("Supabase insert error:", insertError);
  }

  return Response.json({ subject, body });
}

function getToneTemperature(tone: GenerateMailInput["tone"]): number {
  const map: Record<GenerateMailInput["tone"], number> = {
    professional: 0.5,
    concise: 0.4,
    casual: 0.8,
    bold: 0.85,
  };
  return map[tone];
}

function validateGenerateMailInput(value: unknown): GenerateMailInput | { error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { error: "Something was wrong with the request. Please refresh and try again." };
  }

  const payload = value as Record<string, unknown>;
  const recipient = trimText(payload.recipient, 120);
  const company = trimText(payload.company, 120);
  const role = trimText(payload.role, 120);
  const positionType = trimText(payload.positionType, 40);
  const mailType = trimText(payload.mailType, 40);
  const tone = trimText(payload.tone, 40);
  const wordLimit = Number(payload.wordLimit);
  const extraContext = trimText(payload.extraContext, 1000);

  if (!recipient || !company || !role) {
    return { error: "Please fill in the recipient, company, and role fields." };
  }

  if (!POSITION_TYPES.has(positionType)) {
    return { error: "Please choose a valid position type." };
  }

  if (!MAIL_TYPES.has(mailType)) {
    return { error: "Please choose a valid email type." };
  }

  if (!TONES.has(tone)) {
    return { error: "Please choose a valid tone." };
  }

  if (!WORD_LIMITS.has(wordLimit)) {
    return { error: "Please choose one of the available word limits." };
  }

  return {
    recipient,
    company,
    role,
    positionType: positionType as GenerateMailInput["positionType"],
    mailType: mailType as GenerateMailInput["mailType"],
    tone: tone as GenerateMailInput["tone"],
    wordLimit: wordLimit as GenerateMailInput["wordLimit"],
    extraContext,
  };
}
