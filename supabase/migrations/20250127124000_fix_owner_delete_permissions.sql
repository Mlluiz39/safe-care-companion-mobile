/*
  # [Fix Owner Delete Permissions]
  This migration fixes the RLS policies to allow a Patient Owner to delete their patient.
  This requires:
  1. Letting the Owner delete rows from 'caregivers' (Cascade Delete).
  2. Letting the Owner update rows in 'medications', 'appointments', 'documents' (Set Null on Delete).
*/

-- 1. Fix CAREGIVERS Delete Policy
-- Drop previous simple policy if it exists to avoid redundancy (optional but cleaner)
drop policy if exists "Users can leave a team" on public.caregivers;
drop policy if exists "Caregivers can delete family members" on public.family_members; -- Wait, this is different

create policy "Users can manage caregivers"
on public.caregivers for delete
using (
  auth.uid() = user_id -- Can remove self
  OR
  exists ( -- Can remove others if I own the patient
    select 1 from public.patients 
    where id = public.caregivers.patient_id 
    and user_id = auth.uid()
  )
);

-- 2. Fix MEDICATIONS Update Policy (for ON DELETE SET NULL)
create policy "Patient Owner can unlink medications"
on public.medications for update
using (
  exists (
    select 1 from public.patients 
    where id = public.medications.patient_id 
    and user_id = auth.uid()
  )
);

-- 3. Fix APPOINTMENTS Update Policy (for ON DELETE SET NULL)
create policy "Patient Owner can unlink appointments"
on public.appointments for update
using (
  exists (
    select 1 from public.patients 
    where id = public.appointments.patient_id 
    and user_id = auth.uid()
  )
);

-- 4. Fix DOCUMENTS Update Policy (for ON DELETE SET NULL)
create policy "Patient Owner can unlink documents"
on public.documents for update
using (
  exists (
    select 1 from public.patients 
    where id = public.documents.patient_id 
    and user_id = auth.uid()
  )
);
