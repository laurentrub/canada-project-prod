-- Allow authenticated users (admin) to read and update all tables

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'contact_submissions' and policyname = 'authenticated full access') then
    create policy "authenticated full access" on public.contact_submissions for all using (auth.role() = 'authenticated');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'evaluations' and policyname = 'authenticated full access') then
    create policy "authenticated full access" on public.evaluations for all using (auth.role() = 'authenticated');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'consultations' and policyname = 'authenticated full access') then
    create policy "authenticated full access" on public.consultations for all using (auth.role() = 'authenticated');
  end if;
end $$;
