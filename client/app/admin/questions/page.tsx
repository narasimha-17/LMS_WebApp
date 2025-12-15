"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  // FORM STATE
  const [form, setForm] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_options: "", // FIXED
  });

  // Load all questions
  const loadQuestions = async () => {
    try {
      const res = await apiGet("/api/questions");
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading questions:", err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // Save Question (Create or Update)
  const saveQuestion = async () => {
    const endpoint = editingQuestion
      ? `/api/questions/${editingQuestion.question_id}`
      : `/api/questions`;

    const payload = {
      ...form,
      correct_options: form.correct_options.trim().toUpperCase(),
    };

    const res = await apiPost(endpoint, payload);

    if (res.success) {
      alert("Question saved!");
      setShowForm(false);
      setEditingQuestion(null);
      loadQuestions();
    } else {
      alert("Failed to save question.");
    }
  };

  // Delete Question
  const deleteQuestion = async (id: number) => {
    if (!confirm("Delete this question?")) return;

    const res = await apiPost(`/api/questions/${id}`, {}, "DELETE");

    if (res.success) {
      alert("Deleted!");
      loadQuestions();
    }
  };

  if (loading) return <p>Loading questions...</p>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Questions</h1>

        <button
          onClick={() => {
            setForm({
              question_text: "",
              option_a: "",
              option_b: "",
              option_c: "",
              option_d: "",
              correct_options: "",
            });
            setEditingQuestion(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Add Question
        </button>
      </div>

      {/* QUESTION LIST */}
      <div className="space-y-5">
        {questions.map((q) => (
          <div
            key={q.question_id}
            className="p-5 border rounded-lg bg-white shadow-sm"
          >
            <h3 className="font-bold text-lg mb-2">{q.question_text}</h3>

            <ul className="text-gray-700 space-y-1">
              <li>A: {q.option_a}</li>
              <li>B: {q.option_b}</li>
              <li>C: {q.option_c}</li>
              <li>D: {q.option_d}</li>
            </ul>

            <p className="mt-2 text-green-600 font-semibold">
              Correct Answer: {q.correct_options}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded"
                onClick={() => {
                  setEditingQuestion(q);
                  setForm({
                    question_text: q.question_text ?? "",
                    option_a: q.option_a ?? "",
                    option_b: q.option_b ?? "",
                    option_c: q.option_c ?? "",
                    option_d: q.option_d ?? "",
                    correct_options: q.correct_options ?? "",
                  });
                  setShowForm(true);
                }}
              >
                Edit
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => deleteQuestion(q.question_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">

            <h2 className="text-xl font-bold mb-4">
              {editingQuestion ? "Edit Question" : "Add Question"}
            </h2>

            <div className="space-y-3">

              <textarea
                placeholder="Question Text"
                className="w-full border px-3 py-2 rounded h-24"
                value={form.question_text}
                onChange={(e) => setForm({ ...form, question_text: e.target.value })}
              />

              {["a", "b", "c", "d"].map((opt) => (
                <input
                  key={opt}
                  placeholder={`Option ${opt.toUpperCase()}`}
                  className="w-full border px-3 py-2 rounded"
                  value={form[`option_${opt}`]}
                  onChange={(e) =>
                    setForm({ ...form, [`option_${opt}`]: e.target.value })
                  }
                />
              ))}

              <select
                className="w-full border px-3 py-2 rounded"
                value={form.correct_options}
                onChange={(e) => setForm({ ...form, correct_options: e.target.value })}
              >
                <option value="">Select Correct Answer</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>

            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 bg-gray-300 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={saveQuestion}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
