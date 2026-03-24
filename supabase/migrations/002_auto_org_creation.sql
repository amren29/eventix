-- Replace the handle_new_user function to also create an organization
-- when the user signs up with an org_name in their metadata.

create or replace function public.handle_new_user()
returns trigger as $$
declare
  _org_id uuid;
  _org_name text;
  _slug text;
begin
  -- Create profile
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );

  -- If org_name is provided, create organization and link it
  _org_name := new.raw_user_meta_data ->> 'org_name';

  if _org_name is not null and _org_name <> '' then
    -- Generate slug from org name
    _slug := lower(regexp_replace(_org_name, '[^a-zA-Z0-9]+', '-', 'g'));
    _slug := trim(both '-' from _slug);
    -- Append random suffix to ensure uniqueness
    _slug := _slug || '-' || substr(md5(random()::text), 1, 6);

    insert into public.organizations (name, slug, owner_id)
    values (_org_name, _slug, new.id)
    returning id into _org_id;

    -- Link profile to organization and set role to organizer
    update public.profiles
    set organization_id = _org_id, role = 'organizer'
    where id = new.id;
  end if;

  return new;
end;
$$ language plpgsql security definer;
