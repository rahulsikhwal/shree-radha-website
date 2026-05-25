-- Optional helper file. schema.sql already includes this.
-- Run only if you want to reset the default homepage stat rows without duplicating them.

delete from public.home_stats a
using public.home_stats b
where a.label = b.label and a.id > b.id;

create unique index if not exists home_stats_label_unique on public.home_stats(label);

insert into public.home_stats (value, label, sort_order, is_active)
values
('5000+', 'Daily Pair Capacity', 1, true),
('15+', 'Years Experience', 2, true),
('200+', 'Dealer Network', 3, true),
('100%', 'Quality Checked', 4, true)
on conflict (label) do update set
  value = excluded.value,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();
