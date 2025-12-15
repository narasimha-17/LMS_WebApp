"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

export default function TestPage() {
  const TOTAL_TIME = 7200; // 2 hrs

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [index, setIndex] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [timer, setTimer] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(true);

  // ------------------------------------------------------
  // ⏳ COUNTDOWN TIMER
  // ------------------------------------------------------
  useEffect(() => {
    if (!isRunning) return;

    const t = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [isRunning]);

  useEffect(() => {
    if (timer === 0) submitTest(true);
  }, [timer]);

  const formatTime = (t: number) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  // ------------------------------------------------------
  // LOAD QUESTIONS
  // ------------------------------------------------------
  useEffect(() => {
    async function load() {
      const res = await apiGet("/api/questions");
      if (res.success) {
        const list = res.data.sort(() => Math.random() - 0.5).slice(0, 65);
        setQuestions(list);
      }
    }
    load();
  }, []);

  if (!questions.length)
    return <p className="text-center mt-10">Loading questions...</p>;

  const q = questions[index];

  // ------------------------------------------------------
  // SELECT ANSWER
  // ------------------------------------------------------
  const selectAnswer = async (val: string) => {
    const updated = { ...answers, [q.question_id]: val };
    setAnswers(updated);

    await apiPost("/api/test/save-progress", {
      question_id: q.question_id,
      selected_option: val,
    });
  };

  const gotoQuestion = (i: number) => {
    setIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ------------------------------------------------------
  // SUBMIT TEST WITH SPINNER POPUP
  // ------------------------------------------------------
  const submitTest = async (auto = false) => {
    if (submitted || isSubmitting) return;

    setIsRunning(false);
    setIsSubmitting(true);

    try {
      // ⭐ WAIT 2 SECONDS so popup is visible
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await apiPost("/api/test/submit", {
        answers,
        total_questions: questions.length,
        autoSubmitted: auto,
      });
    } catch (err) {
      console.error("Submit Error:", err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  // ------------------------------------------------------
  // RESULT PAGE
  // ------------------------------------------------------
  if (submitted) {
    let score = 0;
    let attempted = 0;

    questions.forEach((q) => {
      const given = answers[q.question_id];
      if (given) attempted++;
      if (given === q.correct_answer) score++;
    });

    const unattempted = questions.length - attempted;

    const timeTaken = TOTAL_TIME - timer;
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;

    // TOPIC ACCURACY FIXED
    const topicStats: any = {};
    questions.forEach((q) => {
      const topic = q.topic || "General";
      if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
      topicStats[topic].total++;

      if (answers[q.question_id] === q.correct_answer) {
        topicStats[topic].correct++;
      }
    });

    const weakTopics = Object.entries(topicStats)
      .map(([topic, d]: any) => ({
        topic,
        accuracy: Math.round((d.correct / d.total) * 100),
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-6">🎉 Test Submitted!</h1>

        <p className="text-2xl mb-6">
          <b>Your Score:</b> {score} / {questions.length}
        </p>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="p-5 bg-blue-50 rounded-xl shadow">
            <p className="text-sm text-gray-600">⏳ Time Taken</p>
            <p className="text-xl font-bold">{mins}m {secs}s</p>
          </div>

          <div className="p-5 bg-green-50 rounded-xl shadow">
            <p className="text-sm text-gray-600">🟩 Attempted</p>
            <p className="text-xl font-bold">{attempted}</p>
          </div>

          <div className="p-5 bg-red-50 rounded-xl shadow">
            <p className="text-sm text-gray-600">⬜ Unattempted</p>
            <p className="text-xl font-bold">{unattempted}</p>
          </div>
        </div>

        {/* WEAK TOPICS */}
        <div className="bg-yellow-50 border p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-bold mb-3">📘 Topics You Should Study More</h2>

          {weakTopics.slice(0, 3).map((t, i) => (
            <p key={i} className="text-lg">
              <b>{t.topic}:</b> Accuracy {t.accuracy}%
            </p>
          ))}
        </div>

        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          onClick={() => (window.location.href = "/test")}
        >
          Try Another Test
        </button>
      </div>
    );
  }

  // ------------------------------------------------------
  // MAIN EXAM UI
  // ------------------------------------------------------
  return (
    <div className="relative">

      {/* TIMER BAR */}
      <div className="fixed top-0 left-0 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-900 
                      text-white text-center text-2xl font-bold shadow-lg z-50">
        ⏳ Time Left: <span className="text-yellow-300">{formatTime(timer)}</span>
      </div>

      {/* ⭐ SMALL SUBMITTING POPUP ⭐ */}
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white px-6 py-6 rounded-xl shadow-xl flex flex-col items-center animate-fadeIn">

            {/* SPINNER */}
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            <p className="mt-4 text-lg font-semibold text-gray-700">
              Submitting your test…
            </p>

            <p className="text-xs text-gray-500 mt-1 animate-pulse">Please wait</p>
          </div>
        </div>
      )}

      {/* ⭐ CONFIRM MODAL ⭐ */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-xl shadow-xl text-center animate-fadeIn">
            <h3 className="font-bold text-xl mb-3">Submit Test?</h3>
            <p className="text-gray-600 mb-5">You cannot change answers later.</p>

            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 bg-gray-300 rounded-lg"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-green-600 text-white rounded-lg"
                onClick={() => {
                  setShowConfirm(false);
                  submitTest(false);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex gap-8 px-6 py-24">

        {/* QUESTION PANEL */}
        <div className="w-3/4">
          <h2 className="text-3xl font-bold mb-6">Question {index + 1} / {questions.length}</h2>

          <div className="bg-white rounded-2xl shadow-lg p-10 border">
            <p className="text-lg font-medium mb-8">{q.question_text}</p>

            <div className="space-y-4">
              {["A", "B", "C", "D"].map((opt) => {
                const label = q[`option_${opt.toLowerCase()}`];
                if (!label) return null;

                const selected = answers[q.question_id] === opt;

                return (
                  <label
                    key={opt}
                    className={`block p-4 rounded-xl border cursor-pointer transition
                      ${
                        selected
                          ? "bg-blue-100 border-blue-500 shadow"
                          : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        className="h-5 w-5"
                        checked={selected}
                        onChange={() => selectAnswer(opt)}
                      />
                      <span className="text-lg">
                        <b>{opt}:</b> {label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => gotoQuestion(index - 1)}
              disabled={index === 0}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={() => gotoQuestion(index + 1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>

        {/* STATUS PANEL */}
        <div className="w-1/4 bg-white border shadow-xl rounded-2xl p-6 sticky top-24">
          <h3 className="text-xl font-bold mb-4">Question Status</h3>

          <div className="grid grid-cols-5 gap-3">
            {questions.map((q, i) => {
              const selected = answers[q.question_id];

              return (
                <button
                  key={q.question_id}
                  onClick={() => gotoQuestion(i)}
                  className={`w-10 h-10 rounded-lg font-bold border 
                    ${
                      i === index
                        ? "bg-yellow-400 border-yellow-600"
                        : selected
                        ? "bg-green-500 text-white border-green-700"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FLOATING SUBMIT BUTTON */}
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-8 right-8 px-10 py-4 bg-green-600 text-white rounded-full 
                   text-xl shadow-2xl hover:bg-green-700 z-50"
      >
        Submit Test
      </button>
    </div>
  );
}
