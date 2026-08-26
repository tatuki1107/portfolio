import type { Metadata } from "next";
import { IBM_Plex_Mono, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Tatsuki Kuwano — AR / AI / Web Developer",
  description: "AR・AI・Webで、体験につながるプロダクトをつくる桑野樹希のポートフォリオ。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="ja" className={`${syne.variable} ${mono.variable}`}><body>{children}</body></html>;
}
