import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * Server-side helper: gets the authenticated user or redirects to login.
 * Use in Server Components and API routes.
 */
export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

/**
 * Server-side helper: gets the authenticated user and their profile.
 * Redirects to login if not authenticated, or to onboarding if no profile.
 */
export async function requireUserWithProfile(
  select = "name, college, year, github, linkedin, portfolio, skills, projects"
) {
  const { supabase, user } = await requireUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(select)
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/onboarding/resume");
  }

  return { supabase, user, profile };
}
