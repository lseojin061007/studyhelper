import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import WhiteNoisePlayer from "./components/WhiteNoisePlayer";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "studyhelper",
  description: "studyhelper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="w-full py-4 flex justify-center items-center pointer-events-none mt-auto">
            <p className="text-white text-xs opacity-80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] font-medium">
              202501183이서진
            </p>
          </footer>
          <WhiteNoisePlayer />
        </AuthProvider>
      </body>
    </html>
  );
}
