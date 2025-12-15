"use client";

import { useState } from "react";

export default function GenerateExamPage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateExam = async () => {
    if (!title.trim()) {
      alert("Please enter an exam title");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/exams/generate-auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam_title: title }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        alert("Failed to generate exam");
      }
    } catch (err) {
      console.error("Error generating exam:", err);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Generate Auto-Balanced Exam</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <label className="font-semibold">Exam Title</label>
        <input
  suppressHydrationWarning
  type="text"
  placeholder="Enter exam title (e.g., Azure Full Mock Test)"
  className="border rounded px-3 py-2 w-full"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  autoComplete="off"
  data-lpignore="true"
  data-form-type="other"
  name="exam_title"
/>


        <button
  suppressHydrationWarning
  onClick={generateExam}
  disabled={loading}
  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
>
  {loading ? "Generating..." : "Generate Exam"}
</button>

      </div>

      {result && (
        <div className="bg-green-50 border border-green-300 p-5 rounded-lg shadow">
          <h2 className="text-xl font-bold text-green-700 mb-2">
            Exam Generated Successfully!
          </h2>

          <p><b>Exam ID:</b> {result.exam_id}</p>
          <p><b>Total Questions:</b> {result.total_questions}</p>

          <div className="mt-3">
            <b>Difficulty Distribution:</b>
            <ul className="ml-5 list-disc">
              <li>Easy: {result.distribution.easy}</li>
              <li>Medium: {result.distribution.medium}</li>
              <li>Hard: {result.distribution.hard}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
