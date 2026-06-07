-- Assign admin role to a user by email.
-- Replace 'ADMIN_EMAIL_HERE' with the actual admin email before running,
-- or run the UPDATE directly in the Supabase SQL editor.
update auth.users
set raw_app_meta_data = jsonb_set(
  coalesce(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
where email = 'ADMIN_EMAIL_HERE';
