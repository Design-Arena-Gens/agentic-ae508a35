import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instagram AI Sales Master",
  description: "Intelligent Instagram sales automation and client conversion system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
