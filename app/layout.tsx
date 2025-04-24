import "../styles/globals.css";
import DarkModeToggle from "../components/DarkModeToggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "Verwalte dein Krypto-Portfolio übersichtlich & modern",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen font-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
        <DarkModeToggle />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}