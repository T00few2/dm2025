import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DM 2025 - Herning",
  description: "Live results fra DM 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
