"use client";

import NavigationMenu from "../components/ui/navigation-menu";

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
      {children}
    </>
  );
}
