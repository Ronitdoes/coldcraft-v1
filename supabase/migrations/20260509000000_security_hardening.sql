-- =============================================
-- SECURITY HARDENING — Rate Limiting + Storage
-- =============================================

-- Private schema for server-only tables
create schema if not exists app_private;

-- Rate limit tracking table (service_role only)
create table if not exists app_private.api_rate_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null check (action in ('generate-mail', 'parse-resume')),
  window_start timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, action, window_start)
);

alter table app_private.api_rate_limits enable row level security;

-- Only service_role can access rate limit data
create policy "Service role manages api rate limits"
on app_private.api_rate_limits
for all
to service_role
using (true)
with check (true);

-- Lock down the private schema from all public roles
revoke all on schema app_private from public, anon, authenticated;
grant usage on schema app_private to service_role;

revoke all on all tables in schema app_private from public, anon, authenticated;
grant all on app_private.api_rate_limits to service_role;

-- Rate limit RPC function (security invoker — runs as the caller)
create or replace function public.consume_rate_limit(
  p_user_id uuid,
  p_action text,
  p_limit integer,
  p_window_seconds integer default 3600
)
returns table (
  allowed boolean,
  remaining integer,
  reset_at timestamptz
)
language plpgsql
security invoker
set search_path = app_private, public
as $$
declare
  v_window_start timestamptz;
  v_request_count integer;
begin
  if p_action not in ('generate-mail', 'parse-resume') then
    raise exception 'Invalid rate limit action';
  end if;

  if p_limit < 1 or p_window_seconds < 1 then
    raise exception 'Invalid rate limit configuration';
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into app_private.api_rate_limits (
    user_id,
    action,
    window_start,
    request_count
  )
  values (
    p_user_id,
    p_action,
    v_window_start,
    1
  )
  on conflict (user_id, action, window_start)
  do update set
    request_count = app_private.api_rate_limits.request_count + 1,
    updated_at = now()
  returning request_count into v_request_count;

  allowed := v_request_count <= p_limit;
  remaining := greatest(p_limit - v_request_count, 0);
  reset_at := v_window_start + make_interval(secs => p_window_seconds);

  return next;
end;
$$;

-- Only service_role can call the rate limit function
revoke all on function public.consume_rate_limit(uuid, text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(uuid, text, integer, integer) to service_role;

-- Lock down storage bucket for resumes
update storage.buckets
set
  file_size_limit = 5242880,
  allowed_mime_types = array['application/pdf']
where id = 'resumes';

-- =============================================
-- PERFORMANCE — Indexes for mail_history
-- =============================================

-- Index for dashboard queries: SELECT * WHERE user_id = ? ORDER BY created_at DESC
create index if not exists idx_mail_history_user_id
on public.mail_history (user_id);

create index if not exists idx_mail_history_user_created
on public.mail_history (user_id, created_at desc);

-- =============================================
-- MAINTENANCE — pg_cron cleanup job
-- =============================================

-- Enable pg_cron extension
create extension if not exists pg_cron with schema pg_catalog;

-- Schedule daily cleanup of expired rate limit entries (3 AM UTC)
select cron.schedule(
  'cleanup-rate-limits',
  '0 3 * * *',
  $$DELETE FROM app_private.api_rate_limits WHERE window_start < now() - interval '24 hours'$$
);
