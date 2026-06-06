-- The handle_new_user trigger runs as supabase_auth_admin (SECURITY INVOKER).
-- Grant INSERT so it can create a profile row when a new auth user is created.
grant insert on public.profiles to supabase_auth_admin;
