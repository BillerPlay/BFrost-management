-- Quest Board schema. Run this in Supabase → SQL Editor → New query.

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  assignee    text,
  priority    text not null default 'common'
              check (priority in ('common','rare','epic','legendary')),
  due_date    date,
  status      text not null default 'todo'
              check (status in ('todo','doing','done')),
  position    bigint not null default 0,
  created_at  timestamptz not null default now()
);

-- The lab requires a public, login-free board, so the anon key reads and writes.
-- This is intentional for a class project — do NOT keep open policies on real data.
alter table public.tasks enable row level security;

create policy "public read"   on public.tasks for select using (true);
create policy "public insert" on public.tasks for insert with check (true);
create policy "public update" on public.tasks for update using (true);
create policy "public delete" on public.tasks for delete using (true);
