import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // <-- Komentari ini
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "@/components/ui/toast";

// const inter = Inter({ subsets: ["latin"] }); // <-- Komentari ini

export const metadata: Metadata = {
  title: "FutsalKu Booking",
  description: "Booking lapangan futsal dengan mudah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`flex flex-col min-h-screen`}> 
        {/* Hapus ${inter.className} dari sini */}
        
        <Header />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
        
      </body>
    </html>
  );
}
