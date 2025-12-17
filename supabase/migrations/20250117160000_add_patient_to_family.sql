/*
  # [Add Patient to Family Members]
  This migration adds a patient_id column to family_members and updates RLS.
*/

-- 1. Add patient_id column
alter table public.family_members 
add column patient_id uuid references public.patients(id) on delete cascade;

-- 2. Update RLS Policies
drop policy if exists "Users can view their own family members." on public.family_members;
create policy "Caregivers can view family members"
on public.family_members for select
using (
  auth.uid() = user_id OR public.is_caregiver(patient_id)
);

drop policy if exists "Users can add their own family members." on public.family_members;
create policy "Caregivers can add family members"
on public.family_members for insert
with check (
  auth.uid() = user_id -- Self-created personal
  OR
  public.is_caregiver(patient_id) -- Created for patient
);

drop policy if exists "Users can update their own family members." on public.family_members;
create policy "Caregivers can update family members"
on public.family_members for update
using (
  auth.uid() = user_id OR public.is_caregiver(patient_id)
);

drop policy if exists "Users can delete their own family members." on public.family_members;
create policy "Caregivers can delete family members"
on public.family_members for delete
using (
  auth.uid() = user_id OR public.is_caregiver(patient_id)
);
