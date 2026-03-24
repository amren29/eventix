import { createClient } from "@/lib/supabase/server";
import { AppShellClient } from "./app-shell-client";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name, avatar_url, organization_id, organizations(name, slug, plan)")
        .eq("id", user.id)
        .single()
    : { data: null };

  const userData = {
    email: user?.email || "",
    name: profile?.full_name || user?.email?.split("@")[0] || "",
    avatarUrl: profile?.avatar_url || "",
    orgName: (profile as any)?.organizations?.name || "",
    orgSlug: (profile as any)?.organizations?.slug || "",
    orgPlan: (profile as any)?.organizations?.plan || "free",
  };

  return <AppShellClient userData={userData}>{children}</AppShellClient>;
}
