/**
 * Fetches a generated card and hands it to the phone's share sheet (so it can go straight
 * to an Instagram or WhatsApp story), or downloads the PNG where sharing files isn't supported.
 */
export async function shareImage(url: string, filename: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`card ${res.status}`);
  const file = new File([await res.blob()], filename, { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file] }).catch(() => {});
    return;
  }
  const href = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = href;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(href);
}
