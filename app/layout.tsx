import type { Metadata } from "next";
import { Inter, Space_Grotesk, Caveat } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

import CustomScrollbar from "@/components/CustomScrollbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Coldcraft",
  description: "Stop getting ignored. Your next internship or job starts with one email.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${caveat.variable} antialiased dark`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background selection:bg-primary selection:text-on-primary" data-mode="connect">
        <CustomScrollbar />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
