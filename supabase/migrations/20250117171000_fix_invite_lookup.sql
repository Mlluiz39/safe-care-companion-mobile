/*
  # Fix Invite Code Lookup

  1. New Function
    - `public.lookup_patient_by_code(code text)`
      - Returns table: (id uuid, name text)
      - Security: SECURITY DEFINER (bypasses RLS)
  
  2. Purpose
    - Allows users to find a patient by code even if they are not yet a caregiver (which RLS prevents).
*/

create or replace function public.lookup_patient_by_code(code text)
returns table (id uuid, name text) 
language plpgsql
security definer
as $$
begin
  return query
  select p.id, p.name
  from public.patients p
  where p.invite_code = code
  limit 1;
end;
$$;
