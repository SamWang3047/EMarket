import type { Metadata } from "next";
import type { ReactNode } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMarket",
  description: "Day 1 foundation for an ecommerce engineering showcase."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const themeInitScript = `try { const saved = localStorage.getItem("emarket.theme"); const theme = saved === "ocean" ? "evergreen" : saved; if (saved === "ocean") { localStorage.setItem("emarket.theme", "evergreen"); } if (theme) { document.documentElement.dataset.theme = theme; } } catch (error) {}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
