import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components/ui/provider"
import { Montserrat } from 'next/font/google'

export const metadata: Metadata = {
  title: "DM 2025 - Herning",
  description: "Live results fra DM 2025",
};

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ['latin'],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={montserrat.variable} suppressHydrationWarning>
      <body>
      <Provider>{children}</Provider>
      </body>
    </html>
  );
}
