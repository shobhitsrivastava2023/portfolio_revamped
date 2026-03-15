import { use } from "react";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";
import { getBlogBySlug, BLOGS } from "../../data/blogs";

export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const dateFormatted = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FFE7D0] font-sans">
      <main className="flex w-full max-w-[562px] flex-col items-center px-4">
        <Navbar />
        <article
          className="flex w-full max-w-[562px] flex-col"
          style={{ marginTop: 50 }}
        >
          <BackButton href="/" />

          <h1
            className="mt-6 w-full font-outfit font-medium text-[#1B1B1B] max-[562px]:text-[clamp(1.75rem,8vw,48px)]"
            style={{
              fontSize: 48,
              letterSpacing: "-0.1em",
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </h1>

          <p
            className="mt-3 font-outfit font-medium text-[#323232]"
            style={{ fontSize: 18 }}
          >
            {dateFormatted}
          </p>

          <div
            className="mt-8 w-full font-outfit font-normal text-[#1B1B1B] text-justify [&_p]:mb-5 [&_p:last-child]:mb-0"
            style={{
              fontSize: 24,
              letterSpacing: "normal",
              lineHeight: 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: post.content.trim() }}
          />

          <div style={{ marginBottom: 60 }} />
        </article>
      </main>
    </div>
  );
}
