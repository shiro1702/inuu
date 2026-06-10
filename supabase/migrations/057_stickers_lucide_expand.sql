-- Expand sticker library with Lucide icons (public/carousel-stickers/*.svg)
-- Run `npm run sync:carousel-stickers` after pulling to refresh SVG files.

insert into public.stickers (category, name, description, tags, image_url, sort_order)
select v.category, v.name, v.description, v.tags, v.image_url, v.sort_order
from (values
  ('decor', 'star', 'Star highlight', array['star','top','featured']::text[], '/carousel-stickers/star.svg', 19),
  ('decor', 'heart', 'Heart', array['heart','romance','love']::text[], '/carousel-stickers/heart.svg', 20),
  ('thematic', 'music', 'Music note', array['music','concert','dj']::text[], '/carousel-stickers/music.svg', 21),
  ('thematic', 'wine', 'Wine glass', array['wine','gastro','bar']::text[], '/carousel-stickers/wine.svg', 22),
  ('thematic', 'camera', 'Camera', array['photo','exhibition','camera']::text[], '/carousel-stickers/camera.svg', 23),
  ('thematic', 'users', 'Group', array['family','friends','group']::text[], '/carousel-stickers/users.svg', 24),
  ('decor', 'zap', 'Energy', array['energy','fast','zap']::text[], '/carousel-stickers/zap.svg', 25),
  ('thematic', 'sun', 'Sun outdoor', array['sun','outdoor','summer']::text[], '/carousel-stickers/sun.svg', 26),
  ('thematic', 'moon', 'Moon nightlife', array['night','nightlife','moon']::text[], '/carousel-stickers/moon.svg', 27),
  ('thematic', 'utensils', 'Restaurant', array['food','restaurant','gastro']::text[], '/carousel-stickers/utensils.svg', 28),
  ('thematic', 'beer', 'Beer', array['beer','bar','pub']::text[], '/carousel-stickers/beer.svg', 29),
  ('thematic', 'tree', 'Park nature', array['park','nature','outdoor']::text[], '/carousel-stickers/tree.svg', 30),
  ('thematic', 'bike', 'Bicycle', array['bike','sport','cycling']::text[], '/carousel-stickers/bike.svg', 31),
  ('thematic', 'baby', 'Kids family', array['kids','family','baby']::text[], '/carousel-stickers/baby.svg', 32),
  ('thematic', 'graduation', 'Education', array['lecture','education','school']::text[], '/carousel-stickers/graduation.svg', 33),
  ('thematic', 'building', 'Venue building', array['venue','building','mall']::text[], '/carousel-stickers/building.svg', 34),
  ('ui', 'car', 'Car parking', array['car','parking','drive']::text[], '/carousel-stickers/car.svg', 35),
  ('thematic', 'plane', 'Travel flight', array['travel','plane','tourism']::text[], '/carousel-stickers/plane.svg', 36),
  ('ui', 'train', 'Train transport', array['train','transport','metro']::text[], '/carousel-stickers/train.svg', 37),
  ('ui', 'bus', 'Bus transport', array['bus','transport']::text[], '/carousel-stickers/bus.svg', 38),
  ('ui', 'phone', 'Phone booking', array['phone','booking','call']::text[], '/carousel-stickers/phone.svg', 39),
  ('navigation', 'globe', 'Web link', array['web','globe','tourism']::text[], '/carousel-stickers/globe.svg', 40),
  ('decor', 'gift', 'Gift holiday', array['gift','holiday','present']::text[], '/carousel-stickers/gift.svg', 41),
  ('thematic', 'croissant', 'Bakery', array['bakery','breakfast','cafe']::text[], '/carousel-stickers/croissant.svg', 42),
  ('thematic', 'headphones', 'Headphones', array['music','podcast','headphones']::text[], '/carousel-stickers/headphones.svg', 43),
  ('thematic', 'video', 'Video stream', array['video','stream','online']::text[], '/carousel-stickers/video.svg', 44),
  ('navigation', 'qr_code', 'QR code', array['qr','link','cta']::text[], '/carousel-stickers/qr_code.svg', 45),
  ('ui', 'percent', 'Discount', array['discount','sale','percent']::text[], '/carousel-stickers/percent.svg', 46),
  ('decor', 'thumbs_up', 'Thumbs up', array['like','recommend','thumbs_up']::text[], '/carousel-stickers/thumbs_up.svg', 47)
) as v(category, name, description, tags, image_url, sort_order)
where not exists (
  select 1 from public.stickers s where s.image_url = v.image_url
);
