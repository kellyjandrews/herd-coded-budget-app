import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Herd Budget | IT spending, made clear",
  description: "A simple budget dashboard for IT teams.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
