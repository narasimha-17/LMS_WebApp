"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const register = async () => {
    const res = await apiPost("/api/auth/register", form);

    if (!res.success) return alert(res.message);

    alert("Registration successful!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">

      {/* LEFT — BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-20 
                      bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-700 
                      text-white">

        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
          GenoSpark
        </h1>

        <p className="text-xl font-medium mb-10 opacity-95 max-w-xl">
          Join a smarter way to prepare for global certifications with
          analytics-driven insights and structured learning.
        </p>

        <blockquote className="border-l-4 border-white/40 pl-6 italic text-lg opacity-90 max-w-xl">
          “Every expert was once a beginner.  
          Start today — and prepare intelligently.”
        </blockquote>

        <div className="mt-16">
          <p className="text-sm opacity-75">
            Build confidence • Track progress • Achieve success
          </p>
        </div>
      </div>

      {/* RIGHT — REGISTER CARD */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">

          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Create Your Account
          </h2>

          <p className="text-gray-500 text-center mb-8">
            Start your GenoSpark learning journey
          </p>

          {/* FIRST NAME */}
          <label className="text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            placeholder="Name"
            className="w-full mt-1 mb-4 px-4 py-3 rounded-lg border 
                       focus:ring-2 focus:ring-indigo-500 outline-none"
            value={form.first_name}
            onChange={(e) =>
              setForm({ ...form, first_name: e.target.value })
            }
          />

          {/* LAST NAME */}
          <label className="text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            placeholder=""
            className="w-full mt-1 mb-4 px-4 py-3 rounded-lg border 
                       focus:ring-2 focus:ring-indigo-500 outline-none"
            value={form.last_name}
            onChange={(e) =>
              setForm({ ...form, last_name: e.target.value })
            }
          />

          {/* EMAIL */}
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mt-1 mb-4 px-4 py-3 rounded-lg border 
                       focus:ring-2 focus:ring-indigo-500 outline-none"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* PASSWORD */}
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a strong password"
            className="w-full mt-1 mb-6 px-4 py-3 rounded-lg border 
                       focus:ring-2 focus:ring-indigo-500 outline-none"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {/* REGISTER BUTTON */}
          <button
            onClick={register}
            className="w-full py-3 rounded-lg text-white font-semibold 
                       bg-indigo-600 hover:bg-indigo-700 transition shadow-md"
          >
            Create Account
          </button>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* LOGIN LINK */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}
