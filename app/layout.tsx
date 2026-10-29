import type { Metadata, Viewport } from "next";
import { Outfit, Urbanist } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site";
import BottomFade from "./components/BottomFade";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Fullstack Developer`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} · Fullstack Developer`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@Shobhit_Talks",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${urbanist.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <BottomFade />
      </body>
    </html>
  );
}
