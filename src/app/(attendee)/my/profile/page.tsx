import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <ProfileClient
      profile={{
        id: profile?.id ?? user.id,
        full_name: profile?.full_name ?? "",
        email: profile?.email ?? user.email ?? "",
        avatar_url: profile?.avatar_url ?? null,
      }}
    />
  );
}
