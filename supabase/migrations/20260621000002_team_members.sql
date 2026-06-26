-- Table: team_members
-- Lie un utilisateur Supabase Auth à un rôle dans l'espace admin
create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.team_members enable row level security;

-- Un membre peut lire sa propre ligne
create policy "self read" on public.team_members
  for select using (auth.uid() = user_id);

-- Seul le service_role gère les membres (invitations via API route admin)
create policy "service_role full access" on public.team_members
  for all using (auth.role() = 'service_role');
