/*
  # [Create Appointments Table]
  This migration creates a new table `appointments` to store appointment information.
*/

-- 1. Create the appointments table
create table public.appointments (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    patient_id uuid references public.patients(id) on delete set null,
    specialty text not null,
    doctor text not null,
    date timestamptz not null,
    location text,
    notes text,
    status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Add comments
comment on table public.appointments is 'Stores medical appointments.';
comment on column public.appointments.user_id is 'Links to the authenticated user.';
comment on column public.appointments.patient_id is 'Links to the patient for the appointment.';
comment on column public.appointments.specialty is 'Medical specialty (e.g., "Cardiologia", "Pediatria").';
comment on column public.appointments.doctor is 'Doctor name.';
comment on column public.appointments.date is 'Date and time of the appointment.';
comment on column public.appointments.status is 'Status of the appointment: scheduled, completed, or cancelled.';

-- 3. Create indexes
create index on public.appointments (user_id);
create index on public.appointments (patient_id);
create index on public.appointments (date);
create index on public.appointments (status);

-- 4. Enable Row Level Security
alter table public.appointments enable row level security;

-- 5. Create RLS policies
create policy "Users can view their own appointments."
on public.appointments for select
using (auth.uid() = user_id);

create policy "Users can add their own appointments."
on public.appointments for insert
with check (auth.uid() = user_id);

create policy "Users can update their own appointments."
on public.appointments for update
using (auth.uid() = user_id);

create policy "Users can delete their own appointments."
on public.appointments for delete
using (auth.uid() = user_id);

-- 6. Create trigger for updated_at
create trigger set_updated_at
    before update on public.appointments
    for each row
    execute function public.handle_updated_at();

