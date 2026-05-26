-- Run once in Supabase SQL Editor after deploying this update.
-- Safe to run multiple times.

alter table public.products add column if not exists gallery_images jsonb default '[]';
alter table public.products add column if not exists detail_sections jsonb default '[]';
alter table public.site_settings add column if not exists theme_color text default '#f59e0b';

-- Required if product image upload bucket was not already created.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Public read for product images.
drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

-- Authenticated admin upload/update/delete for product images.
drop policy if exists "Admin can upload product images" on storage.objects;
create policy "Admin can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Admin can update product images" on storage.objects;
create policy "Admin can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists "Admin can delete product images" on storage.objects;
create policy "Admin can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
