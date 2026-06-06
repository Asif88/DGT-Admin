-- Change handle_new_user to SECURITY DEFINER so it runs as its owner (postgres),
-- which bypasses RLS. auth.uid() is NULL in the trigger context, so SECURITY INVOKER
-- causes the INSERT to be rejected by the profiles RLS policy.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  return new;
end;
$$;
