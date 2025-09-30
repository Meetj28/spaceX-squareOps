"use client";

import { FavoritesProvider } from "@/context/FavoritesContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider>
          <FavoritesProvider>
            <Header />
            <Container>{children}</Container>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
