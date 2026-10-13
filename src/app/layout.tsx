import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AfriGuide",
  description: "Whether you're looking for adventure or culture, Afriguide brings the continent to your fingertips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans bg-white text-black selection:bg-[#1B3D2F] selection:text-white flex justify-center">
        {children}
      </body>
    </html>
  );
}
