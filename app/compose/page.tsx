import { requireUserWithProfile } from "@/utils/supabase/auth";
import ComposeClient from "./client";

export default async function ComposePage() {
  const { profile } = await requireUserWithProfile();

  return (
    <main className="min-h-screen bg-black pt-10 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <ComposeClient profile={profile as any} />
      </div>
    </main>
  );
}
