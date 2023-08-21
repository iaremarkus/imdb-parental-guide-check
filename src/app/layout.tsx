import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "IMDB Parental Guide Checker",
  description: "Created by @iaremarkus"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
