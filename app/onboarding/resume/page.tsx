import { requireUser } from "@/utils/supabase/auth";
import ResumeUploadClient from "./client";

export default async function ResumeUploadPage() {
  await requireUser();
  return <ResumeUploadClient />;
}
