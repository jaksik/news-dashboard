import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "News Dashboard",
  description: "Modern news aggregation dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900`}>
        <Providers>
          <div id="app-root">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
