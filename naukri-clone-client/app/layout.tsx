"use client";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { store } from "../lib/store";
import { Provider } from "react-redux";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naukri Clone",
  description: "Find jobs here",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Provider store={store}>
            <NavBar />
            <Toaster />
            {children}
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
