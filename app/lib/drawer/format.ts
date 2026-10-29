/** "29 oct 2026", in the site's lowercase style. */
export function formatDrawerDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })
    .toLowerCase();
}

/** 83 → "1:23" */
export function formatDuration(seconds?: number): string {
  if (!seconds || !Number.isFinite(seconds)) return "0:00";
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Number of bars drawn for a song. */
export const WAVEFORM_BARS = 160;

/**
 * Browser only: decode an audio file and reduce it to WAVEFORM_BARS peaks
 * between 0 and 1. Done once, on upload (or by the admin page for Telegram
 * uploads), so visitors never download the whole file just to see it.
 */
export async function computeWaveform(data: ArrayBuffer): Promise<{ peaks: number[]; duration: number }> {
  const ctx = new AudioContext();
  try {
    const audio = await ctx.decodeAudioData(data);
    const channel = audio.getChannelData(0);
    const size = Math.floor(channel.length / WAVEFORM_BARS) || 1;
    const peaks: number[] = [];
    for (let i = 0; i < WAVEFORM_BARS; i++) {
      let max = 0;
      for (let j = i * size; j < Math.min((i + 1) * size, channel.length); j++) {
        const v = Math.abs(channel[j]);
        if (v > max) max = v;
      }
      peaks.push(max);
    }
    const top = Math.max(...peaks) || 1;
    return { peaks: peaks.map((p) => Math.round((p / top) * 1000) / 1000), duration: audio.duration };
  } finally {
    await ctx.close();
  }
}
