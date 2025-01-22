import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google"
import React from 'react';
import SessionWrapper from '@/app/wrapper';

export const metadata: Metadata = {
  title: "Spoons 🥄",
  description: "Cover your nose, watch your shoulder",
  icons: "/favicon.png"
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
    <html lang="en" className={roboto.className}>
      <body>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}