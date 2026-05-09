import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpatialDesk",
  description: "Autonomous remodel-proposal agent for newly purchased SF homes"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
