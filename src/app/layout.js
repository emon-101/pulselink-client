import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "PulseLink — Feel the pulse. Save a life.",
  description:
    "PulseLink connects blood donors with people who need them most.",
};

export default function RootLayout({ children }) {

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1">{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}