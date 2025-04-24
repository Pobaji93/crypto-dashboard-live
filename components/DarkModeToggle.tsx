// components/DarkModeToggle.tsx
"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = stored === "dark" || (!stored && prefersDark);

    setDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded shadow"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
