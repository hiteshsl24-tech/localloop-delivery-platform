import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalLoop — Local delivery, made simple",
  description: "A hyperlocal delivery management platform connecting customers, local stores and delivery partners.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
