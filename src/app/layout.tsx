import { Provider } from "react-redux";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { store } from "@/store/store";
import { StoreProvider } from "@/store/storeProvider";
import { LoadingProvider, useLoading } from "@/context/LoadingContext";
import LoaderWrapper from "@/components/LoaderWrapper";
import AppShell from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "95BikeRentals - Your Journey Begins With Perfect Ride",
  description:
    "95BikeRentals is a premium bike and scooter rentals in the city. Book your perfect ride now! Experience the convenience and quality of our service. Book your perfect ride now! Experience the convenience and quality of our service. Book your perfect ride now! Experience the convenience and quality of our service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LoadingProvider>
            <LoaderWrapper />
            <AppShell>{children}</AppShell>
            <Toaster />
          </LoadingProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
