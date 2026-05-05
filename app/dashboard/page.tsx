import { requireUser } from "@/utils/supabase/auth";
import DashboardClient from "./client";

export default async function DashboardPage() {
  await requireUser();
  return <DashboardClient />;
}
