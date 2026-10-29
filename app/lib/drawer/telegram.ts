import { createDrawerItem, upsertDrawerGroupItem } from "./db";
import { newObjectKey, publicUrl, putObject } from "./r2";
import { extractTags, stripTrailingTags, type DrawerItem, type DrawerKind, type DrawerMedia } from "./types";
import { SITE_URL } from "../site";

/** Telegram's bot API only lets bots download files up to 20 MB. */
const MAX_BOT_FILE_BYTES = 20 * 1024 * 1024;

function token(): string {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  return t;
}

export async function telegramApi<T = unknown>(method: string, body?: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${token()}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const json = (await res.json()) as { ok: boolean; result: T; description?: string };
  if (!json.ok) throw new Error(`Telegram ${method} failed: ${json.description}`);
  return json.result;
}

async function reply(chatId: number, messageId: number, text: string) {
  await telegramApi("sendMessage", {
    chat_id: chatId,
    text,
    // Still answer if the original message was deleted in the meantime.
    reply_parameters: { message_id: messageId, allow_sending_without_reply: true },
    link_preview_options: { is_disabled: true },
  });
}

/* The parts of Telegram's Update/Message objects we use. */
type TgFile = { file_id: string; file_size?: number; mime_type?: string; file_name?: string };
type TgMessage = {
  message_id: number;
  chat: { id: number };
  from?: { id: number };
  media_group_id?: string;
  text?: string;
  caption?: string;
  photo?: (TgFile & { width: number; height: number })[];
  video?: TgFile & { width: number; height: number; duration: number };
  animation?: TgFile & { width: number; height: number; duration: number };
  video_note?: TgFile & { length: number; duration: number };
  audio?: TgFile & { duration: number; title?: string; performer?: string };
  voice?: TgFile & { duration: number };
  document?: TgFile;
};
export type TgUpdate = { message?: TgMessage };

type Incoming = { kind: DrawerKind; file: TgFile; mime: string; meta: Omit<DrawerMedia, "key" | "url" | "mime"> };

/** Work out what kind of drawer item a message is, and which file to fetch. */
function classify(m: TgMessage): Incoming | null {
  if (m.photo?.length) {
    const p = m.photo[m.photo.length - 1]; // largest size
    return { kind: "photo", file: p, mime: "image/jpeg", meta: { width: p.width, height: p.height } };
  }
  const video = m.video ?? m.animation;
  if (video) {
    return {
      kind: "video",
      file: video,
      mime: video.mime_type ?? "video/mp4",
      meta: { width: video.width, height: video.height, duration: video.duration },
    };
  }
  if (m.video_note) {
    const v = m.video_note;
    return { kind: "video", file: v, mime: "video/mp4", meta: { width: v.length, height: v.length, duration: v.duration } };
  }
  if (m.audio) {
    const a = m.audio;
    const title = [a.performer, a.title].filter(Boolean).join(" - ") || a.file_name?.replace(/\.[^.]+$/, "");
    return { kind: "audio", file: a, mime: a.mime_type ?? "audio/mpeg", meta: { duration: a.duration, title } };
  }
  if (m.voice) {
    return { kind: "audio", file: m.voice, mime: m.voice.mime_type ?? "audio/ogg", meta: { duration: m.voice.duration, title: "voice note" } };
  }
  // Files sent "as file" (uncompressed photos, .wav songs, original-quality videos)
  const d = m.document;
  if (d?.mime_type) {
    const kind: DrawerKind | null = d.mime_type.startsWith("image/")
      ? "photo"
      : d.mime_type.startsWith("video/")
        ? "video"
        : d.mime_type.startsWith("audio/")
          ? "audio"
          : null;
    if (kind) {
      const title = kind === "audio" ? d.file_name?.replace(/\.[^.]+$/, "") : undefined;
      return { kind, file: d, mime: d.mime_type, meta: { title } };
    }
  }
  return null;
}

/** Copy a Telegram file into R2 and describe it as drawer media. */
async function storeFile(incoming: Incoming): Promise<DrawerMedia> {
  const { file_path } = await telegramApi<{ file_path: string }>("getFile", { file_id: incoming.file.file_id });
  const res = await fetch(`https://api.telegram.org/file/bot${token()}/${file_path}`);
  if (!res.ok) throw new Error(`Telegram file download failed: ${res.status}`);
  const key = newObjectKey(incoming.mime, incoming.file.file_name ?? file_path);
  await putObject(key, await res.arrayBuffer(), incoming.mime);
  return { key, url: publicUrl(key), mime: incoming.mime, ...incoming.meta };
}

function itemLink(item: DrawerItem) {
  return `${SITE_URL}/drawer/${item.id}`;
}

/** Handle one webhook update. Only messages from TELEGRAM_OWNER_ID are posted. */
export async function handleTelegramUpdate(update: TgUpdate): Promise<void> {
  const m = update.message;
  if (!m?.from) return;

  const owner = process.env.TELEGRAM_OWNER_ID;
  if (!owner) {
    await reply(m.chat.id, m.message_id, `Your Telegram id is ${m.from.id}. Set TELEGRAM_OWNER_ID=${m.from.id} to start posting.`);
    return;
  }
  if (String(m.from.id) !== owner) return; // strangers get silence

  const text = m.text ?? m.caption ?? null;
  if (text?.trim() === "/start" || text?.trim() === "/help") {
    await reply(
      m.chat.id,
      m.message_id,
      "Send me a thought, photo, video or song (mp3/wav) and it goes into your drawer. Add #tags at the end of the caption. Files over 20 MB: use /drawer/admin."
    );
    return;
  }

  const body = stripTrailingTags(text);
  const tags = extractTags(text);
  const incoming = classify(m);

  if (!incoming) {
    if (!body) return;
    const item = await createDrawerItem({ kind: "thought", body, media: [], tags, source: "telegram" });
    await reply(m.chat.id, m.message_id, `in the drawer → ${itemLink(item)}`);
    return;
  }

  if ((incoming.file.file_size ?? 0) > MAX_BOT_FILE_BYTES) {
    await reply(m.chat.id, m.message_id, "That file is over Telegram's 20 MB bot limit. Upload it from /drawer/admin instead.");
    return;
  }

  const media = await storeFile(incoming);
  const newItem = { kind: incoming.kind, body, media: [media], tags, source: "telegram" as const };

  if (m.media_group_id) {
    const { item, created } = await upsertDrawerGroupItem(`tg:${m.media_group_id}`, newItem);
    if (created) await reply(m.chat.id, m.message_id, `in the drawer → ${itemLink(item)}`);
    return;
  }

  const item = await createDrawerItem(newItem);
  const note = item.kind === "audio" ? " (open /drawer/admin once to draw its waveform)" : "";
  await reply(m.chat.id, m.message_id, `in the drawer → ${itemLink(item)}${note}`);
}
