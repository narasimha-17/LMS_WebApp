"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const login = async () => {
    setLoading(true);
    try {
      const res = await apiPost("/api/auth/login", { email, password });
      if (!res.success) return alert(res.message || "Invalid Login");

      const user = res.user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.token);

      if (user.role === "admin") return router.push("/admin");
      if (user.role === "instructor") return router.push("/instructor");
      router.push("/certifications");
    } catch {
      alert("Login failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">

      {/* LEFT — BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-20 bg-gradient-to-br 
                      from-indigo-700 via-blue-700 to-purple-700 text-white">

        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
          GenoSpark
        </h1>

        <p className="text-xl font-medium mb-10 opacity-95 max-w-xl">
          Smarter preparation for global certifications — powered by analytics,
          precision, and performance insights.
        </p>

        <blockquote className="border-l-4 border-white/40 pl-6 italic text-lg opacity-90 max-w-xl">
          “Success is not about how hard you study,  
          it’s about how intelligently you prepare.”
        </blockquote>

        <div className="mt-16">
          <p className="text-sm opacity-75">
            Trusted by learners preparing for global exams
          </p>
        </div>
      </div>

      {/* RIGHT — LOGIN CARD */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">

          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-center mb-8">
            Sign in to continue your learning journey
          </p>

          {/* EMAIL */}
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mt-1 mb-5 px-4 py-3 rounded-lg border 
                       focus:ring-2 focus:ring-indigo-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mt-1 mb-6 px-4 py-3 rounded-lg border 
                       focus:ring-2 focus:ring-indigo-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* BUTTON */}
          <button
            onClick={login}
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold 
                       bg-indigo-600 hover:bg-indigo-700 transition 
                       shadow-md disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* REGISTER */}
          <p className="text-center text-gray-600 text-sm">
            New to GenoSpark?{" "}
            <a
              href="/register"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}
