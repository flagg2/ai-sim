"use client";

import "@repo/ui/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@repo/ui/lib/utils";
import { MathJaxContext } from "better-react-mathjax";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html suppressHydrationWarning>
      <body className={cn(inter.className, "h-screen w-screen")}>
        <ThemeProvider attribute="class">
          <MathJaxContext>{children}</MathJaxContext>
        </ThemeProvider>
      </body>
    </html>
  );
}
