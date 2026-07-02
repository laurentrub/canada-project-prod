alter table consultations
  add column if not exists payment_email_sent_at timestamptz;
