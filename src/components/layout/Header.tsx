"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import Button from "../ui/Button";

const staticText = {
  title: "🚀 SpaceX Mission Explorer",
  toggleDark: "🌙 Dark",
  toggleLight: "☀️ Light",
};

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex w-1/2">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-gray-100"
          >
            {staticText.title}
          </Link>
        </div>

        {/* Right side */}
        <div className="flex w-1/2 items-center justify-end gap-6">
          <Button variant="secondary" onClick={toggleTheme}>
            {theme === "light" ? staticText.toggleDark : staticText.toggleLight}
          </Button>
        </div>
      </div>
    </header>
  );
}
