-- =============================================================================
-- One-time cleanup: remove the "Test User" row from the reviews table.
-- Run this in Supabase SQL Editor (it executes as the postgres role and
-- bypasses RLS, which is why the anon key can't do it from the API).
-- =============================================================================

-- Quick precise delete by id (the row we created during smoke testing):
delete from public.reviews
where id = 'ff4647e0-094b-40a4-8845-70efc7f0ee06';

-- Belt-and-braces fallback in case the same name was inserted again:
delete from public.reviews
where author_name ilike 'test user%'
   or device_key = '11111111-1111-1111-1111-111111111111';

-- Verify what's left:
select id, author_name, rating, device_key, created_at
from public.reviews
order by created_at desc;
