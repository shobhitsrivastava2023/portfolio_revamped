/**
 * Canonical site URL. www, because the bare domain redirects to it and Telegram
 * webhooks don't follow redirects. NEXT_PUBLIC_SITE_URL overrides it (e.g. for preview deploys).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shobhitsrivastava.com";

export const SITE_NAME = "Shobhit Srivastava";
export const SITE_DESCRIPTION =
  "Fullstack developer. Builds AI workflow tools, real-time apps, and the odd Enigma machine. Open to full-time roles.";
