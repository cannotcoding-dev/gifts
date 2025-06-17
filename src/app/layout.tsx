import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "기프티(Gifty) - 감성 기반 선물 추천 서비스",
  description: "선물을 고르기 어려운 당신을 위한 감성 기반 선물 추천 서비스입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
