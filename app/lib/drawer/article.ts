/**
 * Articles are written as plain text (usually in Telegram) with a tiny format:
 *
 *   -> A heading            (also →, –>, —>)
 *   A paragraph per line
 *   ('https://…/image.jpg') an image on its own line (quotes optional, curly quotes fine)
 *
 * The first heading, if the article starts with one, becomes the title.
 */
export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string };

export type Article = { title: string | null; blocks: ArticleBlock[]; minutes: number };

const HEADING = /^\s*(?:->|→|–>|—>)\s*(.+)$/;
const IMAGE = /^\s*\(\s*['"‘’“”]?\s*(https?:\/\/[^\s'"‘’“”)]+)\s*['"‘’“”]?\s*\)\s*$/;

/** The #article marker isn't part of the text. */
export function stripArticleTag(text: string): string {
  return text.replace(/(^|\s)#article\b/gi, "$1").trim();
}

export function parseArticle(body: string | null): Article {
  const blocks: ArticleBlock[] = [];
  for (const raw of (body ?? "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const image = line.match(IMAGE);
    const heading = line.match(HEADING);
    if (image) blocks.push({ type: "image", url: image[1] });
    else if (heading) blocks.push({ type: "heading", text: heading[1].trim() });
    else blocks.push({ type: "paragraph", text: line });
  }

  const title = blocks[0]?.type === "heading" ? blocks[0].text : null;
  if (title) blocks.shift();

  const words = blocks.reduce((n, b) => n + (b.type === "image" ? 0 : b.text.split(/\s+/).length), 0);
  return { title, blocks, minutes: Math.max(1, Math.round(words / 200)) };
}

/** Title for cards and link previews: the first heading, or the opening words. */
export function articleTitle(body: string | null): string {
  const { title, blocks } = parseArticle(body);
  if (title) return title;
  const first = blocks.find((b) => b.type !== "image");
  const text = first?.type === "paragraph" || first?.type === "heading" ? first.text : "an article";
  return text.length > 70 ? `${text.slice(0, 67)}...` : text;
}
