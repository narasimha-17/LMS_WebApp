"use client";

import { useRouter } from "next/navigation";

export default function StartTestButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/test")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition"
    >
      Start Test →
    </button>
  );
}
