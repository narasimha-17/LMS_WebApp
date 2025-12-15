"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReactDOM from "react-dom";

export default function AdminLayoutController() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const navbar = document.getElementById("layout-navbar");
    const footer = document.getElementById("layout-footer");
    const main = document.getElementById("layout-main");

    if (!navbar || !footer || !main) return;

    if (isAdmin) {
      // Hide navbar/footer for admin pages
      navbar.innerHTML = "";
      footer.innerHTML = "";
      main.classList.remove("pt-20", "max-w-6xl", "mx-auto", "px-4");
      return;
    }

    // Restore public layout
    navbar.innerHTML = "";
    footer.innerHTML = "";

    ReactDOM.render(<Navbar />, navbar);
    ReactDOM.render(<Footer />, footer);

    main.classList.add("pt-20", "max-w-6xl", "mx-auto", "px-4");
  }, [pathname]);

  return null;
}
