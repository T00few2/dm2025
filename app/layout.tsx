import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components/ui/provider"

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
    <html  suppressHydrationWarning>
      <body>
      <Provider>{children}</Provider>
      </body>
    </html>
  );
}
