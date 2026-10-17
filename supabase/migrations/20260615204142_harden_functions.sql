-- Pin search_path on the trigger helper (advisor 0011)
create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = ''
as $$
begin new.updated_at = now(); return new; end $$;

-- handle_new_user is a trigger function only; it must not be callable as an
-- RPC by anon/authenticated roles (advisors 0028/0029).
revoke execute on function public.handle_new_user() from public, anon, authenticated;
