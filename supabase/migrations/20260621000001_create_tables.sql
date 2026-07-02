-- Table: contact_submissions
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  first_name  text not null,
  last_name   text not null,
  email       text not null,
  country     text,
  nationality text,
  program     text,
  message     text,
  status      text not null default 'new' check (status in ('new', 'in_progress', 'done'))
);

alter table public.contact_submissions enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'contact_submissions' and policyname = 'service_role full access') then
    create policy "service_role full access" on public.contact_submissions for all using (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'contact_submissions' and policyname = 'anon insert') then
    create policy "anon insert" on public.contact_submissions for insert with check (true);
  end if;
end $$;


-- Table: evaluations
create table if not exists public.evaluations (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  first_name            text not null,
  last_name             text not null,
  email                 text not null,
  birth_year            text,
  gender                text,
  nationality           text,
  country               text,
  city                  text,
  marital_status        text,
  spouse_accompanies    text,
  children              text,
  children_accompany    text,
  education             text,
  field_of_study        text,
  diploma_country       text,
  years_of_study        text,
  eca_done              text,
  french_level          text,
  french_test           text,
  french_score          text,
  english_level         text,
  english_test          text,
  english_score         text,
  experience_years      text,
  occupation            text,
  noc_category          text,
  self_employed         text,
  management_experience text,
  job_offer             text,
  canada_study          text,
  canada_work           text,
  canada_visits         text,
  family_in_canada      text,
  family_relation       text,
  previous_application  text,
  refusal_history       text,
  program               text,
  province              text,
  timeline              text,
  budget                text,
  net_worth             text,
  hear_about            text,
  notes                 text,
  consent               boolean not null default false,
  status                text not null default 'new' check (status in ('new', 'in_progress', 'done', 'rejected'))
);

alter table public.evaluations enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'evaluations' and policyname = 'service_role full access') then
    create policy "service_role full access" on public.evaluations for all using (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'evaluations' and policyname = 'anon insert') then
    create policy "anon insert" on public.evaluations for insert with check (true);
  end if;
end $$;


-- Table: consultations
create table if not exists public.consultations (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  date         date not null,
  slot         text not null,
  full_name    text not null,
  email        text not null,
  status       text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'done'))
);

alter table public.consultations enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'consultations' and policyname = 'service_role full access') then
    create policy "service_role full access" on public.consultations for all using (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'consultations' and policyname = 'anon insert') then
    create policy "anon insert" on public.consultations for insert with check (true);
  end if;
end $$;
