/*
  # [Create Family Members Table]
  This migration creates a new table `family_members` to store information about a user's family members. It links each family member to a user in the `auth.users` table.

  ## Query Description: [This operation creates a new table and sets up security policies. It is a non-destructive structural change and should not impact existing data. No backup is required before running, but it's always a good practice.]

  ## Metadata:
  - Schema-Category: ["Structural"]
  - Impact-Level: ["Low"]
  - Requires-Backup: [false]
  - Reversible: [true]

  ## Structure Details:
  - Table: `public.family_members`
  - Columns: `id`, `user_id`, `name`, `relationship`, `avatar_url`, `created_at`
  - Foreign Keys: `family_members.user_id` -> `auth.users.id`

  ## Security Implications:
  - RLS Status: [Enabled]
  - Policy Changes: [Yes]
  - Auth Requirements: [Users must be authenticated to interact with their own data.]

  ## Performance Impact:
  - Indexes: [An index is added on the `user_id` column to speed up queries.]
  - Triggers: [None]
  - Estimated Impact: [Low. Queries will be efficient due to the index on `user_id`.]
*/

-- 1. Create the family_members table
create table public.family_members (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    relationship text not null,
    avatar_url text,
    created_at timestamptz not null default now()
);

-- 2. Add comments to the table and columns
comment on table public.family_members is 'Stores family member profiles for users.';
comment on column public.family_members.user_id is 'Links to the authenticated user.';
comment on column public.family_members.name is 'Name of the family member.';
comment on column public.family_members.relationship is 'Relationship to the user (e.g., Pai, Mãe, Filho).';
comment on column public.family_members.avatar_url is 'URL for the family member''s avatar image.';

-- 3. Create an index for performance
create index on public.family_members (user_id);

-- 4. Enable Row Level Security
alter table public.family_members enable row level security;

-- 5. Create RLS policies
create policy "Users can view their own family members."
on public.family_members for select
using (auth.uid() = user_id);

create policy "Users can add their own family members."
on public.family_members for insert
with check (auth.uid() = user_id);

create policy "Users can update their own family members."
on public.family_members for update
using (auth.uid() = user_id);

create policy "Users can delete their own family members."
on public.family_members for delete
using (auth.uid() = user_id);
