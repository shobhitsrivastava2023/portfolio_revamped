-- Drawer: the personal feed at /drawer (thoughts, photos, clips, songs).
-- Media files live in Cloudflare R2; this table stores what each item is and where its files are.

create table if not exists public.drawer_items (
  id text primary key,                       -- short random id, used in /drawer/<id>
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('thought', 'photo', 'video', 'audio')),
  body text,                                 -- the thought, or the caption for media
  media jsonb not null default '[]'::jsonb,  -- [{ key, url, mime, width?, height?, duration?, title? }]
  waveform jsonb,                            -- audio only: ~160 peaks between 0 and 1
  tags text[] not null default '{}',
  pinned boolean not null default false,
  visibility text not null default 'public' check (visibility in ('public', 'unlisted', 'draft')),
  source text not null default 'admin' check (source in ('admin', 'telegram')),
  group_key text                             -- Telegram album id, so multi-photo posts merge into one item
);

create index if not exists drawer_items_feed_idx
  on public.drawer_items (pinned desc, created_at desc)
  where visibility = 'public';

-- One item per Telegram album: lets concurrent album messages upsert into the same row.
create unique index if not exists drawer_items_group_key_uniq
  on public.drawer_items (group_key)
  where group_key is not null;
