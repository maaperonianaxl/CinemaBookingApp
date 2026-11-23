-- =====================================================================
-- Movie Masters - Supabase schema
-- Run this ONCE in: Supabase Dashboard > SQL Editor > New query > Run
-- Safe to re-run (it drops and recreates policies, triggers and functions).
-- Seat grid used by the app: rows A-H, seats 1-8 (see src/data/showtimes.js)
-- =====================================================================

-- ---------- Tables ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  name         text not null,
  email        text not null,
  avatar       text check (avatar is null or length(avatar) < 400000),
  member_since text not null default to_char(now(), 'YYYY'),
  created_at   timestamptz not null default now()
);

create table if not exists public.bookings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  movie_id   text not null,
  show_date  text not null,                      -- 'YYYY-MM-DD'
  show_time  text not null,                      -- '7:30 PM'
  seats      text[] not null,
  status     text not null default 'ACTIVE' check (status in ('ACTIVE', 'CANCELLED')),
  created_at timestamptz not null default now()
);
create index if not exists bookings_user_idx on public.bookings (user_id);

create table if not exists public.tickets (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  movie_id   text not null,
  show_date  text not null,
  show_time  text not null,
  seat       text not null,
  code       text not null,
  created_at timestamptz not null default now(),
  -- A seat can only be sold once per showtime. This is what prevents double booking.
  unique (movie_id, show_date, show_time, seat)
);
create index if not exists tickets_user_idx on public.tickets (user_id);

-- ---------- Create a profile automatically when someone signs up ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', 'Movie Fan'), new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Row Level Security: users only see their own rows ----------
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.tickets  enable row level security;

drop policy if exists "profiles: read own"   on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;
drop policy if exists "bookings: read own"   on public.bookings;
drop policy if exists "tickets: read own"    on public.tickets;

create policy "profiles: read own" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "bookings: read own" on public.bookings
  for select to authenticated using (auth.uid() = user_id);
create policy "tickets: read own" on public.tickets
  for select to authenticated using (auth.uid() = user_id);
-- No insert/delete policies on purpose: bookings are created and cancelled
-- only through the functions below.

-- ---------- Which seats are taken for a showtime (any user) ----------
create or replace function public.taken_seats(p_movie text, p_date text, p_time text)
returns table (seat text)
language sql
stable
security definer
set search_path = public
as $$
  select t.seat
  from public.tickets t
  where t.movie_id = p_movie and t.show_date = p_date and t.show_time = p_time;
$$;

-- ---------- Book seats (all or nothing) ----------
create or replace function public.book_seats(
  p_movie text, p_date text, p_time text, p_seats text[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking uuid;
  v_seat    text;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  if p_seats is null or cardinality(p_seats) < 1 or cardinality(p_seats) > 6 then
    raise exception 'INVALID_SEATS';
  end if;

  foreach v_seat in array p_seats loop
    if v_seat !~ '^[A-H][1-8]$' then
      raise exception 'INVALID_SEATS';
    end if;
  end loop;

  insert into public.bookings (user_id, movie_id, show_date, show_time, seats)
  values (auth.uid(), p_movie, p_date, p_time, p_seats)
  returning id into v_booking;

  foreach v_seat in array p_seats loop
    insert into public.tickets (booking_id, user_id, movie_id, show_date, show_time, seat, code)
    values (
      v_booking, auth.uid(), p_movie, p_date, p_time, v_seat,
      'MM' || upper(substr(replace(v_booking::text, '-', ''), 1, 5)) || v_seat
    );
  end loop;

  return v_booking;
exception
  when unique_violation then
    raise exception 'SEAT_TAKEN';
end;
$$;

-- ---------- Cancel a booking and free its seats ----------
create or replace function public.cancel_booking(p_booking uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.bookings
    where id = p_booking and user_id = auth.uid() and status = 'ACTIVE'
  ) then
    raise exception 'BOOKING_NOT_FOUND';
  end if;

  delete from public.tickets where booking_id = p_booking;
  update public.bookings set status = 'CANCELLED' where id = p_booking;
end;
$$;

-- Only signed-in users may call the functions
revoke execute on function public.taken_seats(text, text, text) from public, anon;
revoke execute on function public.book_seats(text, text, text, text[]) from public, anon;
revoke execute on function public.cancel_booking(uuid) from public, anon;
grant execute on function public.taken_seats(text, text, text) to authenticated;
grant execute on function public.book_seats(text, text, text, text[]) to authenticated;
grant execute on function public.cancel_booking(uuid) to authenticated;