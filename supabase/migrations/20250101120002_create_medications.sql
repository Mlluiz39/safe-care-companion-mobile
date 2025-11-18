/*
  # [Create Medications Table]
  This migration creates a new table `medications` to store medication information.
*/

-- 1. Create the medications table
create table public.medications (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    patient_id uuid references public.patients(id) on delete set null,
    name text not null,
    dosage text not null,
    frequency text not null,
    start_date date,
    end_date date,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Add comments
comment on table public.medications is 'Stores medication prescriptions.';
comment on column public.medications.user_id is 'Links to the authenticated user.';
comment on column public.medications.patient_id is 'Links to the patient taking the medication.';
comment on column public.medications.name is 'Name of the medication.';
comment on column public.medications.dosage is 'Dosage information (e.g., "1 comp. de 500mg").';
comment on column public.medications.frequency is 'How often to take (e.g., "8h em 8h", "1x ao dia").';

-- 3. Create indexes
create index on public.medications (user_id);
create index on public.medications (patient_id);
create index on public.medications (start_date);
create index on public.medications (end_date);

-- 4. Enable Row Level Security
alter table public.medications enable row level security;

-- 5. Create RLS policies
create policy "Users can view their own medications."
on public.medications for select
using (auth.uid() = user_id);

create policy "Users can add their own medications."
on public.medications for insert
with check (auth.uid() = user_id);

create policy "Users can update their own medications."
on public.medications for update
using (auth.uid() = user_id);

create policy "Users can delete their own medications."
on public.medications for delete
using (auth.uid() = user_id);

-- 6. Create trigger for updated_at
create trigger set_updated_at
    before update on public.medications
    for each row
    execute function public.handle_updated_at();

