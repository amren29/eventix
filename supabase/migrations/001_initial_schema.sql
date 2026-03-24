-- ─── Profiles (extends Supabase auth.users) ────────────────────────────────

create type user_role as enum ('platform_admin', 'organizer', 'staff', 'attendee');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role user_role default 'attendee',
  organization_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

-- ─── Organizations ──────────────────────────────────────────────────────────

create type plan_type as enum ('free', 'pro', 'enterprise');

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  primary_color text default '#4F46E5',
  plan plan_type default 'free',
  owner_id uuid not null references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table organizations enable row level security;

-- Add FK from profiles to organizations
alter table profiles
  add constraint fk_profiles_organization
  foreign key (organization_id) references organizations(id);

-- ─── Events ─────────────────────────────────────────────────────────────────

create type event_status as enum ('draft', 'published', 'cancelled', 'past');
create type event_visibility as enum ('public', 'unlisted', 'private');

create table events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  banner_url text,
  category text not null,
  tags text[] default '{}',
  status event_status default 'draft',
  visibility event_visibility default 'public',
  start_date timestamptz not null,
  end_date timestamptz not null,
  timezone text default 'UTC',
  is_online boolean default false,
  venue_name text,
  venue_address text,
  venue_city text,
  venue_country text,
  venue_lat double precision,
  venue_lng double precision,
  organizer_id uuid not null references auth.users(id),
  organization_id uuid not null references organizations(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table events enable row level security;

-- ─── Ticket Types ───────────────────────────────────────────────────────────

create type ticket_price_type as enum ('paid', 'free', 'donation');

create table ticket_types (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  description text,
  price_type ticket_price_type default 'paid',
  price integer default 0,
  currency text default 'USD',
  quantity integer,
  quantity_sold integer default 0,
  sale_start_date timestamptz,
  sale_end_date timestamptz,
  is_hidden boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table ticket_types enable row level security;

-- ─── Orders ─────────────────────────────────────────────────────────────────

create type order_status as enum ('pending', 'paid', 'refunded', 'cancelled');

create table orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  event_id uuid not null references events(id),
  buyer_id uuid not null references auth.users(id),
  buyer_name text not null,
  buyer_email text not null,
  subtotal integer default 0,
  service_fee integer default 0,
  total integer default 0,
  currency text default 'USD',
  status order_status default 'pending',
  promo_code text,
  discount integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table orders enable row level security;

-- ─── Order Tickets ──────────────────────────────────────────────────────────

create table order_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  ticket_type_id uuid not null references ticket_types(id),
  attendee_name text not null,
  attendee_email text not null,
  qr_code text unique not null,
  checked_in_at timestamptz,
  checked_in_gate text,
  created_at timestamptz default now()
);

alter table order_tickets enable row level security;

-- ─── Promo Codes ────────────────────────────────────────────────────────────

create type discount_type as enum ('percentage', 'fixed', 'free');

create table promo_codes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  event_id uuid references events(id),
  code text not null,
  discount_type discount_type not null,
  discount_value integer default 0,
  max_uses integer,
  used_count integer default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (organization_id, code)
);

alter table promo_codes enable row level security;

-- ─── Auto-create profile on signup ──────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Auto-update updated_at ─────────────────────────────────────────────────

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles for each row execute function update_updated_at();
create trigger organizations_updated_at before update on organizations for each row execute function update_updated_at();
create trigger events_updated_at before update on events for each row execute function update_updated_at();
create trigger ticket_types_updated_at before update on ticket_types for each row execute function update_updated_at();
create trigger orders_updated_at before update on orders for each row execute function update_updated_at();
create trigger promo_codes_updated_at before update on promo_codes for each row execute function update_updated_at();

-- ─── RLS Policies ───────────────────────────────────────────────────────────

-- Profiles: users can read any profile, update their own
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Organizations: members can read, owner can update
create policy "Orgs are viewable by members" on organizations for select using (true);
create policy "Owner can update org" on organizations for update using (auth.uid() = owner_id);
create policy "Authenticated users can create orgs" on organizations for insert with check (auth.uid() = owner_id);

-- Events: public events readable by all, org members can CRUD
create policy "Published events are public" on events for select using (status = 'published' and visibility = 'public');
create policy "Organizers can manage own events" on events for all using (auth.uid() = organizer_id);

-- Ticket types: readable with event, manageable by organizer
create policy "Ticket types visible with event" on ticket_types for select using (
  exists (select 1 from events where events.id = ticket_types.event_id and (events.status = 'published' or events.organizer_id = auth.uid()))
);
create policy "Organizers can manage ticket types" on ticket_types for all using (
  exists (select 1 from events where events.id = ticket_types.event_id and events.organizer_id = auth.uid())
);

-- Orders: buyers see their own, organizers see their event orders
create policy "Buyers can view own orders" on orders for select using (auth.uid() = buyer_id);
create policy "Organizers can view event orders" on orders for select using (
  exists (select 1 from events where events.id = orders.event_id and events.organizer_id = auth.uid())
);
create policy "Authenticated users can create orders" on orders for insert with check (auth.uid() = buyer_id);

-- Order tickets: same as orders
create policy "Buyers can view own tickets" on order_tickets for select using (
  exists (select 1 from orders where orders.id = order_tickets.order_id and orders.buyer_id = auth.uid())
);
create policy "Organizers can view event tickets" on order_tickets for select using (
  exists (
    select 1 from orders
    join events on events.id = orders.event_id
    where orders.id = order_tickets.order_id and events.organizer_id = auth.uid()
  )
);
create policy "Organizers can update tickets (check-in)" on order_tickets for update using (
  exists (
    select 1 from orders
    join events on events.id = orders.event_id
    where orders.id = order_tickets.order_id and events.organizer_id = auth.uid()
  )
);

-- Promo codes: org owners can manage, public can read active codes
create policy "Active promo codes are readable" on promo_codes for select using (is_active = true);
create policy "Org owners can manage promo codes" on promo_codes for all using (
  exists (select 1 from organizations where organizations.id = promo_codes.organization_id and organizations.owner_id = auth.uid())
);
