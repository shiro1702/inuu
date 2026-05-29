-- Group «Гончарный мастер-класс» (Арт-квартал) legacy slugs into one series

update public.events
set
  series_slug = 'goncharnyj-master-klass-art-kvartal',
  starts_at = case slug
    when '--6af91b50' then '2026-06-14T11:00:00+00:00'::timestamptz
    when '--02577eed' then '2026-06-15T11:00:00+00:00'::timestamptz
    when '--e240f628' then '2026-06-15T11:00:00+00:00'::timestamptz
    else starts_at
  end,
  is_published = true
where slug in ('--6af91b50', '--02577eed', '--e240f628');
