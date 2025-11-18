/*
  # [Create Documents Table]
  This migration creates a new table `documents` to store medical documents and exam results.
*/

-- 1. Create the documents table
create table public.documents (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    patient_id uuid references public.patients(id) on delete set null,
    title text not null,
    type text not null,
    date date not null,
    file_url text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Add comments
comment on table public.documents is 'Stores medical documents and exam results.';
comment on column public.documents.user_id is 'Links to the authenticated user.';
comment on column public.documents.patient_id is 'Links to the patient the document belongs to.';
comment on column public.documents.title is 'Title of the document (e.g., "Raio-X do Tórax").';
comment on column public.documents.type is 'Type of document (e.g., "exame", "receita", "atestado").';
comment on column public.documents.date is 'Date of the document/exam.';
comment on column public.documents.file_url is 'URL to the document file if stored externally.';

-- 3. Create indexes
create index on public.documents (user_id);
create index on public.documents (patient_id);
create index on public.documents (date);
create index on public.documents (type);

-- 4. Enable Row Level Security
alter table public.documents enable row level security;

-- 5. Create RLS policies
create policy "Users can view their own documents."
on public.documents for select
using (auth.uid() = user_id);

create policy "Users can add their own documents."
on public.documents for insert
with check (auth.uid() = user_id);

create policy "Users can update their own documents."
on public.documents for update
using (auth.uid() = user_id);

create policy "Users can delete their own documents."
on public.documents for delete
using (auth.uid() = user_id);

-- 6. Create trigger for updated_at
create trigger set_updated_at
    before update on public.documents
    for each row
    execute function public.handle_updated_at();

