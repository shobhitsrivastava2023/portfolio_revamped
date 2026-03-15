"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BLOGS } from "../data/blogs";
import { useLanguage } from "../context/LanguageContext";

export default function Blogs() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    if (searchParams.get("section") === "blogs") {
      requestAnimationFrame(() => {
        document.getElementById("section-blogs")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [searchParams]);

  return (
    <section
      id="section-blogs"
      className="w-full max-w-[562px]"
      style={{ marginTop: 69 }}
    >
      <Link
        href="/blog"
        className="no-underline transition-opacity hover:opacity-80"
      >
        <h2
          className="font-outfit font-medium text-[#1B1B1B] max-[562px]:text-[clamp(2.5rem,20vw,8rem)]"
          style={{
            fontSize: 128,
            letterSpacing: "-0.1em",
          }}
        >
          {t("blogs.title")}
        </h2>
      </Link>
      <ul className="list-none p-0" style={{ marginTop: 50 }}>
        {BLOGS.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}?from=blogs`}
              className="flex min-h-[44px] items-end justify-between gap-4 border-b border-[#323232] py-4 no-underline text-[#323232] transition-opacity hover:opacity-80 first:pt-0 touch-manipulation focus:outline-none focus-visible:opacity-80"
              style={{ borderBottomWidth: 1 }}
            >
              <span
                className="min-w-0 max-w-[396px] max-[562px]:max-w-full font-outfit font-medium"
                style={{
                  fontSize: 36,
                  letterSpacing: "-0.1em",
                }}
              >
                {post.title}
              </span>
              <span
                className="font-outfit font-medium text-[#323232]"
                style={{ fontSize: 18 }}
                aria-hidden
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
