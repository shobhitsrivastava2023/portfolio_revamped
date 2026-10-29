import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing by Shobhit Srivastava on web protocols, automation, and getting hired out of a tier-3 college.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
