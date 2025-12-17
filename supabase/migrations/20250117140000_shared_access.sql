/*
  # [Shared Access System]
  This migration enables multiple users to manage the same patient.
*/

-- 1. Add invite_code to patients
alter table public.patients 
add column invite_code text unique default substring(md5(random()::text) from 0 for 7);

-- 2. Create Caregivers Table (Many-to-Many link)
create table public.caregivers (
    id uuid not null default gen_random_uuid() primary key,
    patient_id uuid not null references public.patients(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null default 'member', -- 'owner', 'member'
    created_at timestamptz not null default now(),
    unique(patient_id, user_id)
);

-- 3. Enable RLS
alter table public.caregivers enable row level security;

-- 4. Policies for Caregivers
create policy "Users can view their caregiving entries"
on public.caregivers for select
using (auth.uid() = user_id);

create policy "Users can join a team (insert self)"
on public.caregivers for insert
with check (auth.uid() = user_id);

-- 5. UPDATE RLS for Patients (Shared Access)
-- Drop old simple policies if they conflict, or use OR logic.
-- Simplified: User can view patient if they are the owner OR they are in caregivers table.

create or replace function public.is_caregiver(patient_uuid uuid)
returns boolean as $$
  select exists (
    select 1 from public.caregivers
    where patient_id = patient_uuid
    and user_id = auth.uid()
  );
$$ language sql security definer;

-- VIEW POLICY
drop policy if exists "Users can view their own patients." on public.patients;
create policy "Users can view patients they care for"
on public.patients for select
using (
  auth.uid() = user_id -- Owner
  OR
  public.is_caregiver(id) -- Shared
);

-- INSERT POLICY (Remains mostly same, creating user is owner)
drop policy if exists "Users can add their own patients." on public.patients;
create policy "Users can create patients"
on public.patients for insert
with check (auth.uid() = user_id);

-- UPDATE POLICY
drop policy if exists "Users can update their own patients." on public.patients;
create policy "Caregivers can update patients"
on public.patients for update
using (
  auth.uid() = user_id OR public.is_caregiver(id)
);

-- 6. Medication/Appointment/Document Policies
-- Update these tables to check `is_caregiver(patient_id)` instead of just `user_id`.

-- MEDICATIONS
drop policy if exists "Users can view their own medications" on public.medications;
create policy "Caregivers can view medications"
on public.medications for select
using (
  auth.uid() = user_id -- Created by me
  OR
  public.is_caregiver(patient_id) -- Or I care for this patient
);

-- APPOINTMENTS
drop policy if exists "Users can view their own appointments" on public.appointments;
create policy "Caregivers can view appointments"
on public.appointments for select
using (
  auth.uid() = user_id OR public.is_caregiver(patient_id)
);

-- DOCUMENTS
drop policy if exists "Users can view their own documents" on public.documents;
create policy "Caregivers can view documents"
on public.documents for select
using (
  auth.uid() = user_id OR public.is_caregiver(patient_id)
);

-- FAMILY MEMBERS
-- Usually personal to the user, but maybe we want a shared family list per patient?
-- For now, keep family members personal to the user account unless requested otherwise.
