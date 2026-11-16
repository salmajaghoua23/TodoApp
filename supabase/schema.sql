-- À exécuter une seule fois : Supabase Dashboard > SQL Editor > New query > Run
-- Les comptes (email + mot de passe) sont gérés par Supabase Auth (table auth.users).
-- Le nom complet est stocké dans les métadonnées de l'utilisateur (full_name).

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  description text not null default '',
  priority    text not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  due_date    date,
  category    text not null default 'Personal',
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists tasks_user_created_idx on public.tasks (user_id, created_at desc);

-- Row Level Security : chaque utilisateur ne voit / modifie QUE ses propres tâches.
alter table public.tasks enable row level security;

drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_insert_own" on public.tasks;
drop policy if exists "tasks_update_own" on public.tasks;
drop policy if exists "tasks_delete_own" on public.tasks;

create policy "tasks_select_own" on public.tasks
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "tasks_insert_own" on public.tasks
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "tasks_update_own" on public.tasks
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "tasks_delete_own" on public.tasks
  for delete to authenticated using ((select auth.uid()) = user_id);
