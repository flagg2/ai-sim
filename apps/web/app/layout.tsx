"use client";

import "@repo/ui/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@repo/ui/utils";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html
      suppressHydrationWarning
      className="overflow-hidden xl:overflow-auto select-none"
    >
      <body className={cn(inter.className, "w-screen")}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
