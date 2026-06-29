create table if not exists payment_settings (
  id          integer primary key default 1 check (id = 1), -- singleton row
  network     text not null default '',
  phone       text not null default '',
  recipient   text not null default '',
  amount      numeric(10,2) not null default 150,
  currency    text not null default 'CAD',
  instructions text not null default '',
  updated_at  timestamptz not null default now()
);

-- Seed a default row so the admin always has something to edit
insert into payment_settings (id) values (1) on conflict do nothing;

-- RLS: only authenticated users (admins) can read/write
alter table payment_settings enable row level security;

create policy "admin read payment_settings"
  on payment_settings for select
  to authenticated using (true);

create policy "admin write payment_settings"
  on payment_settings for update
  to authenticated using (true);
