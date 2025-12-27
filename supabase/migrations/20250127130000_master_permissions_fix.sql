/*
  # [Master Fix: Deletion Permissions]
  This migration consolidates the rules for Deleting Patients and Leaving Teams.
  
  RULES IMPLEMENTED:
  1. Caregiver (Guest): Can delete their own entry in 'caregivers' (Leave Team).
  2. Owner (Admin): Can delete the 'patient' record.
     - This automatically removes all caregivers (Cascade).
     - This unlinks appointments, medications, and documents (Set Null).
*/

-- =========================================================
-- 1. CAREGIVERS: Allow "Guest" to Leave OR Owner to Remove
-- =========================================================
drop policy if exists "Users can leave a team" on public.caregivers;
drop policy if exists "Users can manage caregivers" on public.caregivers;
drop policy if exists "Caregivers can delete family members" on public.family_members;

create policy "Caregivers can leave or Owner can remove"
on public.caregivers for delete
using (
  auth.uid() = user_id -- 1. I am the caregiver leaving
  OR
  exists ( -- 2. I am the owner removing a caregiver
    select 1 from public.patients 
    where id = public.caregivers.patient_id 
    and user_id = auth.uid()
  )
);

-- =========================================================
-- 2. PATIENTS: Allow Owner to Delete
-- =========================================================
drop policy if exists "Users can delete their own patients." on public.patients;

create policy "Owner can delete patient"
on public.patients for delete
using (auth.uid() = user_id);

-- =========================================================
-- 3. CASCADING UPDATES: Allow Owner to Unlink Items
-- =========================================================

-- MEDICATIONS
create policy "Owner can unlink medications"
on public.medications for update
using (
  exists (
    select 1 from public.patients 
    where id = public.medications.patient_id 
    and user_id = auth.uid()
  )
);

-- APPOINTMENTS
create policy "Owner can unlink appointments"
on public.appointments for update
using (
  exists (
    select 1 from public.patients 
    where id = public.appointments.patient_id 
    and user_id = auth.uid()
  )
);

-- DOCUMENTS
create policy "Owner can unlink documents"
on public.documents for update
using (
  exists (
    select 1 from public.patients 
    where id = public.documents.patient_id 
    and user_id = auth.uid()
  )
);
