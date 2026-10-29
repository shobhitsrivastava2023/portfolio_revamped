"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { DrawerItem, DrawerKind, DrawerMedia, DrawerVisibility } from "../../lib/drawer/types";
import { computeWaveform, formatDrawerDate } from "../../lib/drawer/format";

const MAX_PHOTOS = 4;

const buttonClass =
  "min-h-[40px] rounded-[10px] border-0 px-4 font-outfit font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

/** What a post becomes, from the files attached to it. */
function kindFor(files: File[]): DrawerKind {
  if (files.some((f) => f.type.startsWith("audio/"))) return "audio";
  if (files.some((f) => f.type.startsWith("video/"))) return "video";
  return files.length ? "photo" : "thought";
}

async function imageSize(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

function videoMeta(file: File): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight, duration: video.duration });
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => resolve({ width: 16, height: 9, duration: 0 });
    video.src = URL.createObjectURL(file);
  });
}

/** PUT a file to its presigned R2 URL, reporting progress (fetch can't report upload progress). */
function uploadWithProgress(url: string, file: File, onProgress: (fraction: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("content-type", file.type);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
    xhr.onerror = () => reject(new Error("Upload blocked. Is CORS set on the R2 bucket?"));
    xhr.send(file);
  });
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "content-type": "application/json", ...init?.headers } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);
  return json as T;
}

/* ------------------------------------------------------------------ */

function Composer({ onPosted }: { onPosted: (item: DrawerItem) => void }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [visibility, setVisibility] = useState<DrawerVisibility>("public");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const kind = kindFor(files);

  const pickFiles = (list: FileList | null) => {
    const picked = Array.from(list ?? []).filter((f) => /^(image|video|audio)\//.test(f.type));
    const k = kindFor(picked);
    // Photos can be grouped; a clip or song is posted on its own.
    setFiles(k === "photo" ? picked.slice(0, MAX_PHOTOS) : picked.filter((f) => f.type.startsWith(k === "audio" ? "audio/" : "video/")).slice(0, 1));
  };

  const post = async () => {
    setBusy(true);
    try {
      const media: DrawerMedia[] = [];
      let waveform: number[] | undefined;

      for (const [i, file] of files.entries()) {
        const label = files.length > 1 ? ` ${i + 1}/${files.length}` : "";
        setStatus(`preparing${label}...`);
        const extra: Partial<DrawerMedia> = {};
        if (file.type.startsWith("image/")) Object.assign(extra, await imageSize(file).catch(() => ({})));
        if (file.type.startsWith("video/")) Object.assign(extra, await videoMeta(file));
        if (file.type.startsWith("audio/")) {
          setStatus("drawing the waveform...");
          const { peaks, duration } = await computeWaveform(await file.arrayBuffer());
          waveform = peaks;
          Object.assign(extra, { duration, title: file.name.replace(/\.[^.]+$/, "") });
        }

        const { key, uploadUrl, url } = await api<{ key: string; uploadUrl: string; url: string }>("/api/drawer/upload-url", {
          method: "POST",
          body: JSON.stringify({ mime: file.type, name: file.name }),
        });
        await uploadWithProgress(uploadUrl, file, (f) => setStatus(`uploading${label} ${Math.round(f * 100)}%`));
        media.push({ key, url, mime: file.type, ...extra });
      }

      setStatus("posting...");
      const { item } = await api<{ item: DrawerItem }>("/api/drawer/items", {
        method: "POST",
        body: JSON.stringify({ kind, body: text, media, waveform, visibility }),
      });
      onPosted(item);
      setText("");
      setFiles([]);
      if (fileInput.current) fileInput.current.value = "";
      setStatus("in the drawer ✓");
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const canPost = !busy && (kind === "thought" ? text.trim().length > 0 : files.length > 0);

  return (
    <section className="mt-8 rounded-[10px] bg-[#323232] p-4 text-[#FFE7D0]">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={files.length ? "caption (optional). #tags at the end" : "what's on your mind? #tags at the end"}
        rows={4}
        className="block w-full resize-y rounded-[8px] border-0 bg-[#FFE7D0]/8 p-3 text-[#FFE7D0] outline-none placeholder:text-[#FFE7D0]/40 focus:bg-[#FFE7D0]/12"
        style={{ fontSize: 16, lineHeight: 1.45 }}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className={`${buttonClass} inline-flex items-center bg-[#FFE7D0]/12 text-[#FFE7D0]`} style={{ fontSize: 14 }}>
          {files.length ? "change files" : "attach photo / clip / song"}
          <input
            ref={fileInput}
            type="file"
            accept="image/*,video/*,audio/*,.wav,.mp3"
            multiple
            className="sr-only"
            onChange={(e) => pickFiles(e.target.files)}
          />
        </label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as DrawerVisibility)}
          className="min-h-[40px] rounded-[10px] border-0 bg-[#FFE7D0]/12 px-3 font-outfit text-[#FFE7D0]"
          style={{ fontSize: 14 }}
        >
          <option value="public">public</option>
          <option value="unlisted">unlisted (link only)</option>
          <option value="draft">draft</option>
        </select>
        <button type="button" disabled={!canPost} onClick={post} className={`${buttonClass} ml-auto bg-[#FC6E20] text-[#323232]`} style={{ fontSize: 15 }}>
          post as {kind}
        </button>
      </div>

      {files.length > 0 && (
        <p className="mt-2 opacity-70" style={{ fontSize: 13 }}>
          {files.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`).join(" · ")}
        </p>
      )}
      {status && (
        <p className="mt-2 font-outfit font-medium" style={{ fontSize: 14 }}>
          {status}
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function TelegramPanel() {
  const [info, setInfo] = useState<{ bot?: string; webhook?: string | null; lastError?: string | null; ownerSet?: boolean; error?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (method: "GET" | "POST") => {
    setBusy(true);
    const res = await fetch("/api/drawer/telegram/setup", { method });
    setInfo(await res.json());
    setBusy(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/drawer/telegram/setup")
      .then((res) => res.json())
      .then((json) => !cancelled && setInfo(json))
      .catch(() => !cancelled && setInfo({ error: "couldn't reach the bot" }));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mt-6 rounded-[10px] border-2 border-[#323232] p-4 text-[#323232]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-outfit font-medium" style={{ fontSize: 18, letterSpacing: "-0.04em" }}>
          telegram {info?.bot ? `@${info.bot}` : ""}
        </p>
        <button type="button" disabled={busy} onClick={() => load("POST")} className={`${buttonClass} bg-[#323232] text-[#FFE7D0]`} style={{ fontSize: 14 }}>
          {info?.webhook ? "reconnect" : "connect"}
        </button>
      </div>
      <p className="mt-1 opacity-75" style={{ fontSize: 13, lineHeight: 1.5 }}>
        {info === null
          ? "checking..."
          : info.error
            ? info.error
            : [
                info.webhook ? `webhook: ${info.webhook}` : "not connected yet: deploy, then press connect",
                info.ownerSet ? "owner set ✓" : "owner not set: message the bot once, it replies with your id",
                info.lastError ? `last error: ${info.lastError}` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function DrawerAdmin({ initialItems }: { initialItems: DrawerItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [note, setNote] = useState<string | null>(null);

  const replace = (item: DrawerItem) => setItems((all) => all.map((i) => (i.id === item.id ? item : i)));

  const patch = async (id: string, body: Partial<DrawerItem>) => {
    try {
      const { item } = await api<{ item: DrawerItem }>(`/api/drawer/items/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      replace(item);
    } catch (err) {
      setNote((err as Error).message);
    }
  };

  const remove = async (item: DrawerItem) => {
    if (!confirm(`Delete this ${item.kind}? Its files are deleted too.`)) return;
    try {
      await api(`/api/drawer/items/${item.id}`, { method: "DELETE" });
      setItems((all) => all.filter((i) => i.id !== item.id));
    } catch (err) {
      setNote((err as Error).message);
    }
  };

  // Songs posted from Telegram have no waveform yet: draw them here, once.
  useEffect(() => {
    const missing = initialItems.filter((i) => i.kind === "audio" && !i.waveform?.length && i.media[0]);
    if (!missing.length) return;
    let cancelled = false;
    (async () => {
      for (const item of missing) {
        if (cancelled) return;
        try {
          setNote(`drawing waveform for "${item.media[0].title ?? item.id}"...`);
          const data = await (await fetch(item.media[0].url)).arrayBuffer();
          const { peaks } = await computeWaveform(data);
          await patch(item.id, { waveform: peaks });
        } catch {
          setNote("couldn't read a song file to draw its waveform (check CORS on the R2 bucket)");
          return;
        }
      }
      setNote(null);
    })();
    return () => {
      cancelled = true;
    };
    // Runs once for what was missing on load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await fetch("/api/drawer/login", { method: "DELETE" });
    router.refresh();
  };

  return (
    <>
      <Composer onPosted={(item) => setItems((all) => [item, ...all])} />
      <TelegramPanel />

      {note && (
        <p className="mt-4 font-outfit font-medium text-[#323232]" style={{ fontSize: 14 }}>
          {note}
        </p>
      )}

      <ul className="m-0 mt-8 flex list-none flex-col gap-3 p-0">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[10px] border-2 border-[#323232]/15 p-3 text-[#323232]">
            <span className="rounded-md bg-[#323232] px-2 py-0.5 font-outfit text-[12px] font-medium text-[#FFE7D0]">{item.kind}</span>
            <a href={`/drawer/${item.id}`} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-[#323232] no-underline hover:underline" style={{ fontSize: 14 }}>
              {item.body || item.media[0]?.title || item.id}
            </a>
            <span className="opacity-60" style={{ fontSize: 12 }}>
              {formatDrawerDate(item.createdAt)}
            </span>
            <div className="flex w-full items-center gap-2 min-[480px]:w-auto">
              <select
                value={item.visibility}
                onChange={(e) => patch(item.id, { visibility: e.target.value as DrawerVisibility })}
                className="min-h-[32px] rounded-md border border-[#323232]/30 bg-transparent px-2 font-outfit"
                style={{ fontSize: 13 }}
              >
                <option value="public">public</option>
                <option value="unlisted">unlisted</option>
                <option value="draft">draft</option>
              </select>
              <button
                type="button"
                onClick={() => patch(item.id, { pinned: !item.pinned })}
                className={`min-h-[32px] rounded-md border-0 px-2 font-outfit cursor-pointer ${item.pinned ? "bg-[#FC6E20] text-[#323232]" : "bg-[#323232]/10 text-[#323232]"}`}
                style={{ fontSize: 13 }}
              >
                {item.pinned ? "pinned" : "pin"}
              </button>
              <button type="button" onClick={() => remove(item)} className="min-h-[32px] rounded-md border-0 bg-transparent px-2 font-outfit text-[#C2410C] cursor-pointer hover:underline" style={{ fontSize: 13 }}>
                delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button type="button" onClick={logout} className="mt-8 self-start border-0 bg-transparent p-0 font-outfit text-[#323232]/70 underline cursor-pointer" style={{ fontSize: 13 }}>
        log out
      </button>
    </>
  );
}
