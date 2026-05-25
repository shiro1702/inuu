-- INUU baseline: extensions, enums, shared helpers

create extension if not exists pgcrypto;

do $$ begin
  create type public.inuu_org_type as enum (
    'beauty_salon',
    'event_organizer',
    'confectioner',
    'editorial',
    'venue_operator',
    'advertiser',
    'platform'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.inuu_booking_type as enum (
    'event',
    'beauty',
    'confectioner',
    'tourism_lead',
    'other'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.inuu_booking_status as enum (
    'pending',
    'confirmed',
    'cancelled',
    'completed',
    'no_show'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.inuu_entity_type as enum (
    'venue',
    'event',
    'provider',
    'tourism_listing',
    'curated_list',
    'festival'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.inuu_story_author_type as enum (
    'editorial',
    'venue',
    'organization'
  );
exception when duplicate_object then null;
end $$;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
