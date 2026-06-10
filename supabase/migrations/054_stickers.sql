-- Carousel sticker library (wave 4c)

create table if not exists public.stickers (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text,
  tags text[] not null default '{}',
  image_url text not null,
  is_vector boolean not null default true,
  accent_recolorable boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_stickers_category on public.stickers (category, sort_order);
create index if not exists idx_stickers_tags on public.stickers using gin (tags);

alter table public.stickers enable row level security;

drop policy if exists stickers_service on public.stickers;
create policy stickers_service on public.stickers for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists stickers_public_read on public.stickers;
create policy stickers_public_read on public.stickers for select using (true);

-- MVP seed: 18 stickers (public SVG paths)
insert into public.stickers (category, name, description, tags, image_url, sort_order) values
  ('thematic', 'geo_pin', 'Location pin', array['location','map','venue','geo_pin'], '/carousel-stickers/geo_pin.svg', 1),
  ('ui', 'calendar', 'Calendar', array['date','schedule','calendar'], '/carousel-stickers/calendar.svg', 2),
  ('ui', 'clock', 'Clock', array['time','schedule','clock'], '/carousel-stickers/clock.svg', 3),
  ('thematic', 'tickets', 'Tickets', array['ticket','concert','cinema','tickets'], '/carousel-stickers/tickets.svg', 4),
  ('ui', 'price_tag', 'Price tag', array['price','money','price_tag'], '/carousel-stickers/price_tag.svg', 5),
  ('thematic', 'mic', 'Microphone', array['concert','music','karaoke','mic'], '/carousel-stickers/mic.svg', 6),
  ('thematic', 'masks', 'Theatre masks', array['theatre','comedy','masks'], '/carousel-stickers/masks.svg', 7),
  ('thematic', 'disco_ball', 'Disco ball', array['party','club','dance','disco_ball'], '/carousel-stickers/disco_ball.svg', 8),
  ('thematic', 'clapperboard', 'Clapperboard', array['cinema','movie','clapperboard'], '/carousel-stickers/clapperboard.svg', 9),
  ('thematic', 'palette', 'Palette', array['art','exhibition','palette'], '/carousel-stickers/palette.svg', 10),
  ('thematic', 'lightbulb', 'Lightbulb', array['lecture','business','workshop','lightbulb'], '/carousel-stickers/lightbulb.svg', 11),
  ('thematic', 'sneaker', 'Sneaker', array['sport','run','sneaker'], '/carousel-stickers/sneaker.svg', 12),
  ('thematic', 'balloon', 'Balloon', array['kids','family','balloon'], '/carousel-stickers/balloon.svg', 13),
  ('decor', 'fire', 'Fire hype', array['hot','hype','popular','fire'], '/carousel-stickers/fire.svg', 14),
  ('navigation', 'bookmark', 'Bookmark', array['save','favorite','bookmark'], '/carousel-stickers/bookmark.svg', 15),
  ('navigation', 'paper_plane', 'Share', array['share','repost','paper_plane'], '/carousel-stickers/paper_plane.svg', 16),
  ('ui', 'exclamation', 'Important', array['important','alert','exclamation'], '/carousel-stickers/exclamation.svg', 17),
  ('thematic', 'coffee_cup', 'Coffee', array['weekend','brunch','cafe','coffee_cup'], '/carousel-stickers/coffee_cup.svg', 18);
