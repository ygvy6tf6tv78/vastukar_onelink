-- =============================================================================
-- Dogra Associates — OneLink Reviews (paste entire file in Supabase SQL Editor)
-- =============================================================================
--
-- AFTER RUNNING:
--   1. Project Settings → API → copy Project URL + service_role key into .env.local
--      SUPABASE_URL=...
--      SUPABASE_SERVICE_ROLE_KEY=...
--
-- ONE REVIEW PER PERSON (choose one strategy):
--
-- A) Device key (implemented in this app — no login):
--    Column `device_key` is UNIQUE. The site stores a random UUID in
--    localStorage and sends it with each POST. Same browser = one review.
--    Limitation: clearing storage or another device allows another review.
--
-- B) Supabase Auth (stronger — true “one logged-in user = one review”):
--    1. Enable Email or Phone auth in Authentication → Providers.
--    2. Add column:  alter table public.reviews add column user_id uuid unique;
--    3. In your API route, verify the JWT (anon key + user session) and set
--      user_id = auth.uid() on insert; reject if a row exists for that user_id.
--    4. Optionally drop UNIQUE(device_key) if you only trust auth.
--
-- Row Level Security: this Next.js app uses the SERVICE ROLE key server-side,
-- so RLS bypasses are OK for the API. If you expose Supabase anon key to the
-- browser for direct inserts, enable RLS and write policies separately.
--
-- =============================================================================

-- Clean slate (optional — comment out if you already have data)
-- drop table if exists public.reviews cascade;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  text text not null,
  approved boolean not null default true,
  source text not null default 'onelink',
  device_key text unique,
  created_at timestamptz not null default now()
);

create index if not exists reviews_created_at_idx
  on public.reviews (created_at desc);

comment on column public.reviews.device_key is
  'Stable anonymous id from browser localStorage; UNIQUE enforces one review per device.';

-- ---------------------------------------------------------------------------
-- Row Level Security policies
-- ---------------------------------------------------------------------------
-- We're using the public ANON key from the server, so we MUST allow it to
-- read approved rows and insert new ones. (Service role key bypasses RLS,
-- so these policies are also harmless if you switch later.)

alter table public.reviews enable row level security;

drop policy if exists "Public can read approved reviews" on public.reviews;
create policy "Public can read approved reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (approved = true);

drop policy if exists "Anyone can submit a review" on public.reviews;
create policy "Anyone can submit a review"
  on public.reviews
  for insert
  to anon, authenticated
  with check (
    char_length(author_name) between 2 and 60
    and char_length(text) between 10 and 1000
    and rating between 1 and 5
  );

-- ---------------------------------------------------------------------------
-- Demo reviews (CA context — delete these rows in production if you prefer)
-- ---------------------------------------------------------------------------

insert into public.reviews (author_name, rating, text, approved, source, device_key, created_at)
values
  (
    'Priya Malhotra',
    5,
    'Professional ITR filing and clear communication throughout. Deadlines were met and queries answered on WhatsApp quickly. Highly recommend Dogra Associates for salaried individuals.',
    true,
    'onelink',
    'demo-seed-priya',
    now() - interval '18 days'
  ),
  (
    'Rajesh Khanna',
    5,
    'GST registration and monthly compliance handled smoothly. They explained every step in simple terms and kept our books audit-ready. Excellent CA firm for small businesses.',
    true,
    'onelink',
    'demo-seed-rajesh',
    now() - interval '9 days'
  ),
  (
    'Ananya Sharma',
    4,
    'Good tax planning session before the assessment year. Would appreciate slightly faster email replies during peak season, but overall satisfied with the advisory and documentation.',
    true,
    'onelink',
    'demo-seed-ananya',
    now() - interval '3 days'
  )
on conflict (device_key) do nothing;

-- ---------------------------------------------------------------------------
-- Upgrading from an older `reviews` table (no `device_key` yet)
-- ---------------------------------------------------------------------------
-- Run these if you already had a table without device_key:
--
--   alter table public.reviews add column if not exists device_key text;
--   create unique index if not exists reviews_device_key_uq
--     on public.reviews (device_key);
--
-- (Multiple NULL device_keys are allowed; each non-null value must be unique.)
--
-- Optional — Supabase Auth (one review per logged-in account):
--   alter table public.reviews add column if not exists user_id uuid unique;
--   create index if not exists reviews_user_id_idx on public.reviews (user_id);
