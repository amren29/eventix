import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) redirect("/login");

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, slug, logo_url, primary_color, plan, owner_id")
    .eq("id", profile.organization_id)
    .single();

  if (!org) redirect("/login");

  return (
    <SettingsClient
      profile={{
        id: profile.id,
        full_name: profile.full_name ?? "",
        email: profile.email ?? user.email ?? "",
      }}
      org={{
        id: org.id,
        name: org.name ?? "",
        slug: org.slug ?? "",
        logo_url: org.logo_url ?? null,
        primary_color: org.primary_color ?? "",
        plan: org.plan ?? "free",
      }}
    />
  );
}
