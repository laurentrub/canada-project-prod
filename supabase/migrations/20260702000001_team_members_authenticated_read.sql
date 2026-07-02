-- Allow any authenticated admin to read the full team members list
-- (previously only self-read was allowed, leaving the members table
-- empty for everyone except the row's own owner)

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'team_members' and policyname = 'authenticated read') then
    create policy "authenticated read" on public.team_members for select using (auth.role() = 'authenticated');
  end if;
end $$;
