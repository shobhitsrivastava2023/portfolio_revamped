"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { parseArticle } from "../../lib/drawer/article";

/** Height of a collapsed article in the feed; the rest fades out under "read more". */
const COLLAPSED_HEIGHT = 340;
const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

/** Paragraph text with bare links made clickable. */
function Linkified({ text }: { text: string }) {
  return (
    <>
      {text.split(URL_PATTERN).map((part, i) =>
        i % 2 === 1 ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="break-all text-[#323232] underline decoration-[#FC6E20] decoration-2 underline-offset-2">
            {part}
          </a>
        ) : (
          part
        )
      )}
    </>
  );
}

/**
 * An article: title, reading time, then headings, paragraphs and images.
 * With `truncate`, long articles are cut at COLLAPSED_HEIGHT with a fade and
 * expand in place.
 */
export default function ArticleView({ body, truncate = false }: { body: string | null; truncate?: boolean }) {
  const { title, blocks, minutes } = parseArticle(body);
  const contentRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Only show the fade and button if the article is actually taller than the cut.
  useEffect(() => {
    const el = contentRef.current;
    if (!truncate || !el) return;
    const check = () => setOverflows(el.scrollHeight > COLLAPSED_HEIGHT + 40);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [truncate]);

  const collapsed = truncate && overflows && !expanded;

  return (
    <div className="w-full">
      {title && (
        <h2
          className="font-outfit font-medium text-[#1B1B1B]"
          style={{ fontSize: "clamp(28px, 6.5vw, 40px)", letterSpacing: "-0.06em", lineHeight: 1.05 }}
        >
          {title}
        </h2>
      )}
      <p className="mt-2 font-outfit font-medium text-[#FC6E20]" style={{ fontSize: 13, letterSpacing: "-0.02em" }}>
        {minutes} min read
      </p>

      <motion.div
        className="relative overflow-hidden"
        initial={false}
        animate={{ height: collapsed ? COLLAPSED_HEIGHT : "auto" }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div ref={contentRef} className="flex flex-col gap-4 pt-4">
          {blocks.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h3
                  key={i}
                  className="mt-3 font-outfit font-medium text-[#1B1B1B]"
                  style={{ fontSize: "clamp(21px, 4.6vw, 26px)", letterSpacing: "-0.05em", lineHeight: 1.15 }}
                >
                  {block.text}
                </h3>
              );
            }
            if (block.type === "image") {
              return (
                // External image links can come from anywhere, so a plain <img> rather than next/image.
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={block.url} alt="" loading="lazy" className="w-full rounded-[10px] bg-[#323232]/10" />
              );
            }
            return (
              <p key={i} className="text-[#323232]" style={{ fontSize: 17, lineHeight: 1.65 }}>
                <Linkified text={block.text} />
              </p>
            );
          })}
        </div>

        {/* Fade into the page background while collapsed */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to bottom, rgba(255, 231, 208, 0), #FFE7D0)" }}
          initial={false}
          animate={{ opacity: collapsed ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {truncate && overflows && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="mt-3 min-h-[36px] rounded-[8px] border-0 bg-[#323232] px-3 font-outfit font-medium text-[#FFE7D0] cursor-pointer transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#323232] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFE7D0]"
          style={{ fontSize: 14, letterSpacing: "-0.03em" }}
        >
          {expanded ? "show less" : "read more"}
        </button>
      )}
    </div>
  );
}
