create extension if not exists "pgcrypto";

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('bug', 'feature_request', 'idea', 'contribution')),
  app_id text,
  content text not null check (char_length(content) between 20 and 5000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index feedback_created_at_idx on public.feedback (created_at desc);
create index feedback_status_idx on public.feedback (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger feedback_set_updated_at
before update on public.feedback
for each row execute function public.set_updated_at();

alter table public.feedback enable row level security;
alter table public.admin_users enable row level security;

create policy "Admins can view their allowlist entry"
on public.admin_users for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Admins can view feedback"
on public.feedback for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Admins can update feedback"
on public.feedback for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

revoke all on public.feedback from anon;
revoke all on public.admin_users from anon;
grant select, update on public.feedback to authenticated;
grant select on public.admin_users to authenticated;
