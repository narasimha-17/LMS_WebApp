"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TakeExamPage() {
  const { examId } = useParams();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  // Load exam questions
  useEffect(() => {
    async function loadExam() {
      try {
        const res = await fetch(`/api/exams/${examId}/questions`);
        const data = await res.json();

        if (data.success) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error("Failed to load exam:", err);
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [examId]);

  if (loading) return <p>Loading Exam...</p>;
  if (questions.length === 0) return <p>No questions found.</p>;

  const currentQuestion = questions[currentIndex];

  const selectAnswer = (option: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.question_id]: option,
    });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const submitExam = () => {
    setSubmitted(true);
  };

  if (submitted) {
    const correctCount = questions.filter((q) =>
      answers[q.question_id] === q.correct_answer
    ).length;

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Exam Submitted</h1>
        <p className="text-xl">
          Your Score:{" "}
          <b>
            {correctCount} / {questions.length}
          </b>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-bold">
        Question {currentIndex + 1} of {questions.length}
      </h1>

      <div className="p-5 bg-white rounded shadow">
        <h2 className="font-bold mb-4">{currentQuestion.question_text}</h2>

        {["A", "B", "C", "D"].map((opt) => {
          const key = opt.toLowerCase();
          return (
            <label
              key={opt}
              className="block p-3 border rounded mb-2 cursor-pointer hover:bg-gray-100"
            >
              <input
                type="radio"
                name="option"
                value={opt}
                checked={answers[currentQuestion.question_id] === opt}
                onChange={() => selectAnswer(opt)}
                className="mr-2"
              />
              {opt}: {currentQuestion[`option_${key}`]}
            </label>
          );
        })}
      </div>

      <div className="flex justify-between mt-4">
        <button
          disabled={currentIndex === 0}
          onClick={prevQuestion}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submitExam}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Submit Exam
          </button>
        )}
      </div>
    </div>
  );
}
