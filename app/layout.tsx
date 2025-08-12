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
      <body className="min-h-screen font-sans bg-tr-light text-gray-900 dark:bg-tr-dark dark:text-tr-light transition-colors">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
        <DarkModeToggle />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
