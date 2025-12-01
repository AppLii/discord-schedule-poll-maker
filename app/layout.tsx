import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discord 日程調整アンケート作成ツール｜AppLii",
  description: "Discord向けの日程調整アンケート作成ツール｜AppLii",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
