alter table public.questions
  drop column media_type,
  drop column media_url,
  add column image_url text,
  add column video_url text;
