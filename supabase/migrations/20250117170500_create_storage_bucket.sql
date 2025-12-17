/*
  # Create Storage Bucket for Avatars

  1. Storage
    - Create a new public bucket named `avatars`
  
  2. Security
    - Enable RLS (default for storage)
    - Add policy for public read access to avatars
    - Add policy for authenticated users to upload avatars
    - Add policy for users to update their own avatars
*/

-- 1. Create the bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Set up RLS policies

-- Public Read Access
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Authenticated Upload Access
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Update Access (Users can update their own files)
create policy "Users can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.uid() = owner );

-- Delete Access (Users can delete their own files)
create policy "Users can delete their own avatar."
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.uid() = owner );
