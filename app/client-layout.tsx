"use client";

import NavigationMenu from "../components/ui/navigation-menu";
import Footer from "../components/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* GLOBAL VIDEO BACKGROUND */}
      <div className="video-bg">
        <video autoPlay loop muted playsInline preload="auto">
          <source src="/brain.mp4" type="video/mp4" />
        </video>
      </div>

      {/* NAVBAR */}
      <NavigationMenu />

      {/* PAGE CONTENT */}
      <main className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1">
          {children}
        </div>

        {/* FOOTER */}
        <Footer />
      </main>
    </>
  );
}
