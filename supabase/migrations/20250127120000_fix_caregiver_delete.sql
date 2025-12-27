/*
  # [Fix Caregiver Delete Policy]
  This migration adds a policy to allow caregivers to remove themselves from a team.
*/

-- Allow users to delete their own caregiver entry
create policy "Users can leave a team"
on public.caregivers for delete
using (auth.uid() = user_id);
