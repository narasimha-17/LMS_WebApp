"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages where navbar should NOT appear
  const hideNavbarRoutes = ["/", "/login", "/register" , "/logout" , "/admin"];

  const hideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <>
      {/* Conditionally show Navbar */}
      {!hideNavbar && <Navbar />}

      <main className={`${hideNavbar ? "" : "pt-20"} max-w-6xl mx-auto px-4`}>
        {children}
      </main>

      {/* Hide Footer on login/register/home if needed */}
      {!hideNavbar && <Footer />}
    </>
  );
}
