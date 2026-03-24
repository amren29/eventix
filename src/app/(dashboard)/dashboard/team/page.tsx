import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TeamClient } from "./team-client";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch current user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) redirect("/login");

  // Fetch organization to get owner_id
  const { data: org } = await supabase
    .from("organizations")
    .select("id, owner_id")
    .eq("id", profile.organization_id)
    .single();

  // Fetch all members in the same organization
  const { data: members } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url")
    .eq("organization_id", profile.organization_id)
    .order("full_name", { ascending: true });

  return (
    <TeamClient
      members={members ?? []}
      currentUserId={user.id}
      ownerId={org?.owner_id ?? null}
    />
  );
}
