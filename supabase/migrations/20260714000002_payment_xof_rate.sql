alter table public.payment_settings
  add column if not exists xof_rate numeric(10,2) not null default 460;
