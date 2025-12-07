import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationMenu from "../components/ui/navigation-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeuroBioMark",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* GLOBAL VIDEO BACKGROUND */}
        <div className="video-bg">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/brain.mp4" type="video/mp4" />

          </video>
        </div>

        {/* NAVBAR */}
        <NavigationMenu />

        {/* PAGE CONTENT */}
        {children}
      </body>
    </html>
  );
}
