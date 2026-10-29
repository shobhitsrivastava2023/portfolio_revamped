import { randomBytes } from "crypto";
import { AwsClient } from "aws4fetch";

/**
 * Cloudflare R2 through its S3-compatible API.
 * R2_ENDPOINT is the account endpoint (https://<account>.r2.cloudflarestorage.com),
 * R2_PUBLIC_URL is where the bucket is served publicly (r2.dev URL or a custom domain).
 */
function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function client() {
  return new AwsClient({
    accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    service: "s3",
    region: "auto",
  });
}

function objectUrl(key: string): string {
  const endpoint = requiredEnv("R2_ENDPOINT").replace(/\/+$/, "");
  return `${endpoint}/${requiredEnv("R2_BUCKET")}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export function publicUrl(key: string): string {
  return `${requiredEnv("R2_PUBLIC_URL").replace(/\/+$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/wave": "wav",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
  "audio/flac": "flac",
};

/** drawer/2026/10/<random>.<ext>: dated folders keep the bucket browsable. */
export function newObjectKey(mime: string, fallbackName = "file"): string {
  const ext = EXTENSIONS[mime] ?? fallbackName.split(".").pop()?.toLowerCase() ?? "bin";
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `drawer/${now.getUTCFullYear()}/${month}/${randomBytes(8).toString("hex")}.${ext}`;
}

/** A short-lived URL the browser can PUT a file to directly (big files never pass through Vercel). */
export async function presignUpload(key: string, mime: string, expiresSeconds = 900): Promise<string> {
  const url = new URL(objectUrl(key));
  url.searchParams.set("X-Amz-Expires", String(expiresSeconds));
  const signed = await client().sign(new Request(url, { method: "PUT", headers: { "content-type": mime } }), {
    aws: { signQuery: true },
  });
  return signed.url;
}

/** Server-side upload (used for files fetched from Telegram). */
export async function putObject(key: string, body: ArrayBuffer, mime: string): Promise<void> {
  const res = await client().fetch(objectUrl(key), {
    method: "PUT",
    headers: { "content-type": mime },
    body,
  });
  if (!res.ok) throw new Error(`R2 upload failed: ${res.status} ${await res.text()}`);
}

export async function deleteObject(key: string): Promise<void> {
  const res = await client().fetch(objectUrl(key), { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error(`R2 delete failed: ${res.status}`);
}
