import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriSmart AI",
  description: "AI-powered crop health and disease detection system",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}