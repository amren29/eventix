-- Create storage bucket for event banners
insert into storage.buckets (id, name, public)
values ('event-banners', 'event-banners', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy "Authenticated users can upload banners"
on storage.objects for insert
to authenticated
with check (bucket_id = 'event-banners');

-- Allow public read access
create policy "Public can view banners"
on storage.objects for select
to public
using (bucket_id = 'event-banners');

-- Allow owners to delete their banners
create policy "Users can delete own banners"
on storage.objects for delete
to authenticated
using (bucket_id = 'event-banners');
