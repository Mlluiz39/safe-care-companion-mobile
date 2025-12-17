/*
  # Create Profiles Table

  1. New Tables
    - `public.profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text)
      - `avatar_url` (text)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `public.profiles` table
    - Add policies for authenticated users to manage their own profile data
*/

create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  username text,
  avatar_url text,
  updated_at timestamptz
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );
