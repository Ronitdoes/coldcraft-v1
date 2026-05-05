import { groq } from "@/lib/groq";
import { RESUME_PARSE_PROMPT } from "@/lib/prompts";
import { createClient } from "@/utils/supabase/server";
import { extractText } from "unpdf";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(`${user.id}/resume.pdf`, new Blob([arrayBuffer], { type: "application/pdf" }), {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return Response.json({ error: "Failed to store resume" }, { status: 500 });
    }

    // 2. Extract text using unpdf (no worker needed)
    const { text: pages, totalPages } = await extractText(new Uint8Array(arrayBuffer));
    const resumeText = pages.join("\n");

    console.log(`[parse-resume] Extracted ${totalPages} pages, ${resumeText.length} chars`);
    console.log(`[parse-resume] First 200 chars: ${resumeText.substring(0, 200)}`);

    if (!resumeText || resumeText.trim().length < 20) {
      return Response.json(
        { error: "Resume text too short or empty", debug: { totalPages, textLength: resumeText.length } },
        { status: 400 }
      );
    }

    // 3. Pass text to Groq
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

    let parsed;
    try {
      const raw = completion.choices[0].message.content ?? "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      return Response.json({ error: "Invalid JSON from parser. Try again." }, { status: 500 });
    }

    // 4. Save parsed data to profiles table
    const { error: dbError } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      name: parsed.name || "",
      college: parsed.college || "",
      year: parsed.year || "",
      github: parsed.github || "",
      linkedin: parsed.linkedin || "",
      portfolio: parsed.portfolio || "",
      skills: parsed.skills || [],
      projects: parsed.projects || []
    });

    if (dbError) {
      console.error("DB error:", dbError);
      return Response.json({ error: "Failed to save profile data" }, { status: 500 });
    }

    return Response.json({ success: true, data: parsed });
  } catch (err) {
    console.error("PDF extraction error:", err);
    return Response.json({ error: "Failed to process resume." }, { status: 500 });
  }
}

