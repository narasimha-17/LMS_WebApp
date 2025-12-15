"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const filters = [
    { key: "daily", label: "Today" },
    { key: "weekly", label: "This Week" },
    { key: "monthly", label: "This Month" },
    { key: "all", label: "All Time" },
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await apiGet(`/api/leaderboard?range=${filter}`);
      setLeaders(res.data || []);
      setLoading(false);
    }
    load();
  }, [filter]);

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">

      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
        🏆 Leaderboard
      </h1>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-8">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm transition 
              ${
                filter === f.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-xl shadow-lg border bg-white">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold">Rank</th>
              <th className="p-4 font-semibold">Student</th>
              <th className="p-4 font-semibold">Score</th>
              <th className="p-4 font-semibold">Exams Taken</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : leaders.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No leaderboard data available.
                </td>
              </tr>
            ) : (
              leaders.map((user, index) => (
                <tr
                  key={user.user_id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="p-4 font-bold text-blue-600">{index + 1}</td>

                  <td className="p-4">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>

                  <td className="p-4 text-lg font-semibold">
                    {user.best_score}%
                  </td>

                  <td className="p-4">{user.exams_taken}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Motivational Banner */}
      <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 text-center shadow">
        <h2 className="text-2xl font-bold text-blue-800">
          Keep learning. Keep improving. 🚀
        </h2>
        <p className="text-gray-700 mt-2">
          Challenge yourself and climb the leaderboard every week!
        </p>
      </div>

    </section>
  );
}
