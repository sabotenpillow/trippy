import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trippy - 旅行経路共有アプリ",
  description: "旅行の経由地や目的地、滞在時間、移動方法をURLで共有",
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
