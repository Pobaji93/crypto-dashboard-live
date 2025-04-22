import "../styles/globals.css";
export const metadata = {
  title: "Crypto Dashboard",
  description: "Live crypto prices and portfolio tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
