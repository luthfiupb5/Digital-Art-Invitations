import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Arjun & Priya — Wedding Invitation",
  description:
    "Join us to celebrate the wedding of Arjun and Priya. A cinematic experience of love and togetherness.",
  openGraph: {
    title: "Arjun & Priya — Wedding Invitation",
    description: "You are invited to witness our love story begin.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0e0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${crimson.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload first frame */}
        <link
          rel="preload"
          as="image"
          href="/Sequence1/frame_00001_result.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/Sequence1/frame_00002_result.webp"
          type="image/webp"
        />
      </head>
      <body>
        {/* Landscape orientation blocker */}
        <div className="landscape-blocker">
          <div style={{ fontSize: "2rem" }}>🌿</div>
          <p style={{ fontSize: "1.2rem", fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}>
            Please rotate your device to portrait mode
          </p>
          <p style={{ fontSize: "0.85rem", opacity: 0.6, letterSpacing: "0.1em" }}>
            This experience is designed for portrait viewing
          </p>
        </div>
        <div className="mobile-shell-outer">
          {children}
        </div>
      </body>
    </html>
  );
}
