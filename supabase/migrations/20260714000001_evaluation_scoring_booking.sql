-- Score d'éligibilité + statut pipeline commercial sur evaluations
alter table public.evaluations
  add column if not exists score integer,
  add column if not exists result_email_sent_at timestamptz;

alter table public.evaluations drop constraint if exists evaluations_status_check;

update public.evaluations set status = 'new' where status = 'new';
update public.evaluations set status = 'contacted' where status = 'in_progress';
update public.evaluations set status = 'converted' where status = 'done';
update public.evaluations set status = 'lost' where status = 'rejected';

alter table public.evaluations
  add constraint evaluations_status_check check (status in ('new', 'contacted', 'converted', 'lost'));

-- Lien évaluation -> consultation + fuseau horaire du prospect
alter table public.consultations
  add column if not exists evaluation_id uuid references public.evaluations(id) on delete set null,
  add column if not exists timezone text;
