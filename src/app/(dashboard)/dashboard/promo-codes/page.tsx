import { createClient } from "@/lib/supabase/server";
import PromoCodesClient, { type PromoCode, type EventOption } from "./promo-codes-client";

export default async function PromoCodesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user!.id)
    .single();

  const orgId = profile?.organization_id;

  // Fetch events for this org (for event dropdown and name mapping)
  const { data: orgEvents } = orgId
    ? await supabase
        .from("events")
        .select("id, title")
        .eq("organization_id", orgId)
    : { data: [] };

  const eventMap = Object.fromEntries((orgEvents || []).map((e: any) => [e.id, e.title]));
  const eventOptions: EventOption[] = (orgEvents || []).map((e: any) => ({ id: e.id, title: e.title }));

  // Fetch promo codes for this org
  const { data: dbCodes } = orgId
    ? await supabase
        .from("promo_codes")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false })
    : { data: [] };

  const codes: PromoCode[] = (dbCodes || []).map((c: any) => ({
    id: c.id,
    code: c.code,
    type: c.discount_type,
    value: c.discount_value,
    event: c.event_id ? (eventMap[c.event_id] || "Unknown Event") : "All Events",
    eventId: c.event_id,
    used: c.used_count || 0,
    limit: c.max_uses || 999,
    active: c.is_active,
    expires: c.expires_at
      ? new Date(c.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—",
  }));

  return (
    <PromoCodesClient
      initialCodes={codes}
      events={eventOptions}
      organizationId={orgId || ""}
    />
  );
}
