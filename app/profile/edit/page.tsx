import { requireUser } from "@/utils/supabase/auth";
import EditProfileClient from "./client";

export default async function EditProfilePage() {
  await requireUser();
  return <EditProfileClient />;
}
