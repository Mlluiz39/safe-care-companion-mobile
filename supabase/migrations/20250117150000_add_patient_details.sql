/*
  # [Add Patient Details]
  This migration adds an allergies column to the patients table.
  Note: birth_date already exists in the table definition.
*/

alter table public.patients 
add column allergies text;

comment on column public.patients.allergies is 'List of patient allergies.';
