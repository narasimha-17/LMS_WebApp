import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "GenoSpark Mock Tests",
  description: "Practice mock tests for global certifications",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-800">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
