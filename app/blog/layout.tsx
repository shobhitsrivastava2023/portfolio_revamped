import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Shobhit",
  description: "Blog posts by Shobhit",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
