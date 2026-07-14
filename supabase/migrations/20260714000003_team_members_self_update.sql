-- Un membre peut modifier sa propre ligne (prénom/nom depuis "Mon profil"),
-- mais un trigger empêche toute élévation de privilège : le rôle ne peut
-- être changé que par service_role (routes serveur admin), jamais en self-service.
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'team_members' and policyname = 'self update name') then
    create policy "self update name" on public.team_members
      for update using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

create or replace function public.team_members_lock_role()
returns trigger as $$
begin
  if auth.role() <> 'service_role' and new.role is distinct from old.role then
    new.role := old.role;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists team_members_lock_role_trigger on public.team_members;
create trigger team_members_lock_role_trigger
  before update on public.team_members
  for each row execute function public.team_members_lock_role();
