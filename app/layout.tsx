import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google"

export const metadata: Metadata = {
  title: "Spoons 🥄",
  description: "Cover your nose, watch your shoulder"
};

const roboto = Roboto({
  weight: "400",
  subsets: ['latin']
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={roboto.className}>
      <link rel="icon" href="/favicon.png" sizes="any"/>
      {children}
    </body>
    </html>
  );
}
