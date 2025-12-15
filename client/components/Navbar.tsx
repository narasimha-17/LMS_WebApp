"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on onboarding pages
  const hideOn = ["/login", "/register"];
  if (hideOn.includes(pathname)) return null;

  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("token");

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          GenoSpark <span className="text-gray-900">Prep</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 text-sm font-medium items-center">

          <Link 
            href="/certifications"
            className="hover:text-blue-600 transition"
          >
            Certifications
          </Link>

          <Link 
            href="/leaderboard"
            className="hover:text-blue-600 transition"
          >
            Leaderboard
          </Link>

          <Link 
            href="/pricing"
            className="hover:text-blue-600 transition"
          >
            Pricing
          </Link>

          {/* --- RIGHT SIDE BUTTONS --- */}
          {!isLoggedIn ? (
            <>
             

              <Link 
                href="/register"
                className="px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
