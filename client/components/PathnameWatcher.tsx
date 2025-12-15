"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import ReactDOM from "react-dom";

export default function PathnameWatcher() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const navbarEl = document.getElementById("layout-navbar");
    const footerEl = document.getElementById("layout-footer");
    const mainEl = document.getElementById("layout-main");

    if (!navbarEl || !footerEl || !mainEl) return;

    if (isAdmin) {
      navbarEl.innerHTML = "";
      footerEl.innerHTML = "";
      mainEl.classList.remove("pt-20", "max-w-6xl", "mx-auto", "px-4");
    } else {
      navbarEl.innerHTML = "";
      footerEl.innerHTML = "";

      ReactDOM.render(<Navbar />, navbarEl);
      ReactDOM.render(<Footer />, footerEl);

      mainEl.classList.add("pt-20", "max-w-6xl", "mx-auto", "px-4");
    }
  }, [pathname]);

  return null;
}
