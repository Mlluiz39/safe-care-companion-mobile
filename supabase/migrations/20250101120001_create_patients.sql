/*
  # [Create Patients Table]
  This migration creates a new table `patients` to store patient information.
*/

-- 1. Create the patients table
create table public.patients (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    birth_date date,
    gender text,
    phone text,
    email text,
    address text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Add comments
comment on table public.patients is 'Stores patient information.';
comment on column public.patients.user_id is 'Links to the authenticated user.';
comment on column public.patients.name is 'Full name of the patient.';
comment on column public.patients.birth_date is 'Date of birth of the patient.';
comment on column public.patients.gender is 'Gender of the patient.';

-- 3. Create indexes
create index on public.patients (user_id);
create index on public.patients (name);

-- 4. Enable Row Level Security
alter table public.patients enable row level security;

-- 5. Create RLS policies
create policy "Users can view their own patients."
on public.patients for select
using (auth.uid() = user_id);

create policy "Users can add their own patients."
on public.patients for insert
with check (auth.uid() = user_id);

create policy "Users can update their own patients."
on public.patients for update
using (auth.uid() = user_id);

create policy "Users can delete their own patients."
on public.patients for delete
using (auth.uid() = user_id);

-- 6. Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 7. Create trigger for updated_at
create trigger set_updated_at
    before update on public.patients
    for each row
    execute function public.handle_updated_at();

