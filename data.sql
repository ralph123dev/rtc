create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  client_id text unique,
  full_name text,
  email text,
  avatar_url text,
  access_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles add column if not exists access_code text;

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Admin can read all profiles" on public.profiles;
create policy "Admin can read all profiles"
  on public.profiles
  for select
  using ((auth.jwt() ->> 'email') = 'rtcmailpro@gmail.com');

drop policy if exists "Admin can update profiles" on public.profiles;
create policy "Admin can update profiles"
  on public.profiles
  for update
  using ((auth.jwt() ->> 'email') = 'rtcmailpro@gmail.com');

create or replace function public.generate_client_id()
returns text
language plpgsql
as $$
declare
  new_id text;
  id_exists boolean;
begin
  loop
    new_id := lpad(floor(random() * 900000 + 100000)::int::text, 6, '0');
    select exists(select 1 from public.profiles where client_id = new_id) into id_exists;
    exit when not id_exists;
  end loop;
  return new_id;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, client_id, full_name, email, avatar_url)
  values (
    new.id,
    public.generate_client_id(),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

create or replace function public.admin_set_access_code(target_user_id uuid, new_code text)
returns text
language plpgsql
security definer
as $$
begin
  if (auth.jwt() ->> 'email') <> 'rtcmailpro@gmail.com' then
    raise exception 'Accès réservé à l administrateur';
  end if;

  update public.profiles
  set access_code = trim(new_code),
      updated_at = now()
  where id = target_user_id;

  return trim(new_code);
end;
$$;

create or replace function public.verify_access_code(entered_code text)
returns boolean
language plpgsql
security definer
as $$
declare
  is_valid boolean;
begin
  select exists(
    select 1 from public.profiles
    where id = auth.uid()
      and access_code is not null
      and access_code = trim(entered_code)
  ) into is_valid;

  return is_valid;
end;
$$;

create or replace function public.check_user_has_access()
returns boolean
language plpgsql
security definer
as $$
declare
  has_access boolean;
begin
  if (auth.jwt() ->> 'email') = 'rtcmailpro@gmail.com' then
    return true;
  end if;

  select exists(
    select 1 from public.profiles
    where id = auth.uid()
      and access_code is not null
      and length(trim(access_code)) > 0
  ) into has_access;

  return has_access;
end;
$$;

insert into public.profiles (id, client_id, full_name, email, avatar_url)
select 
  u.id,
  public.generate_client_id(),
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  u.email,
  coalesce(u.raw_user_meta_data ->> 'avatar_url', null)
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

create index if not exists idx_profiles_client_id on public.profiles(client_id);
create index if not exists idx_profiles_access_code on public.profiles(access_code);
