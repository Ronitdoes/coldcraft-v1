import { requireUser } from "@/utils/supabase/auth";
import DashboardClient from "./client";

const PAGE_SIZE = 10;

export default async function DashboardPage() {
  const { user, supabase } = await requireUser();

  // Concurrent fetching on the server — paginate mail history
  const [profileResponse, mailResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('mail_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(0, PAGE_SIZE - 1),
  ]);

  const mails = mailResponse.data || [];

  return (
    <DashboardClient 
      initialUser={user}
      initialProfile={profileResponse.data}
      initialMailHistory={mails}
      initialHasMore={mails.length === PAGE_SIZE}
    />
  );
}
