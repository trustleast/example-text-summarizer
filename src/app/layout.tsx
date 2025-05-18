import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/plus-jakarta-sans";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/400.css";

export const metadata: Metadata = {
  title: "Text Summarizer",
  description: "Generate summaries of text",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
