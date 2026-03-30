import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "Last Call Wedding Co. | Dual-Venue Wedding Experiences",
  description:
    "Two distinct venues. One unforgettable day. Discover rustic western charm and moody speakeasy elegance at Last Call Wedding Co. — where your wedding story becomes legend.",
  keywords:
    "wedding venue, rustic wedding, speakeasy wedding, outdoor wedding, historic venue, wedding planning",
  openGraph: {
    title: "Last Call Wedding Co.",
    description: "Choose Your Setting. Begin Your Story.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
