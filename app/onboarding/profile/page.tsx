import { requireUser } from "@/utils/supabase/auth";
import ProfileReviewClient from "./client";

export default async function ProfileReviewPage() {
  await requireUser();
  return <ProfileReviewClient />;
}
