import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const japanese = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const editorial = Shippori_Mincho({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-dun-nine-27.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "桑野 樹希 | AR・AI・3D Creative Developer",
  description:
    "AR・AI・Web・3Dを横断して体験をつくる、桑野樹希のインタラクティブポートフォリオ。",
  keywords: ["桑野樹希", "Tatsuki Kuwano", "WebAR", "AI", "3D", "Portfolio"],
  authors: [{ name: "Tatsuki Kuwano", url: "https://github.com/tatuki1107" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    title: "Tatsuki Kuwano — AR / AI / 3D",
    description: "画面の外へ続く体験をつくる。AR・AI・Web・3Dの作品アーカイブ。",
    siteName: "Tatsuki Kuwano Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tatsuki Kuwano — AR / AI / 3D",
    description: "画面の外へ続く体験をつくる。",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#151718",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${display.variable} ${japanese.variable} ${editorial.variable}`}>
      <body>{children}</body>
    </html>
  );
}
