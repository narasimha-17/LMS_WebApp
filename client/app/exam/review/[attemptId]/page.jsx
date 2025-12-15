"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import QuestionCard from "@/components/QuestionCard";
import Button from "@/components/Button";

export default function ReviewPage({ params }: any) {
  const { attemptId } = params;

  const [answers, setAnswers] = useState<any[]>([]);
  const [examInfo, setExamInfo] = useState<any>(null);

  useEffect(() => {
    const loadReview = async () => {
      const res = await api.get(`/exam-answers/attempt/${attemptId}`);
      const data = res.data.data;

      setAnswers(data);

      if (data.length > 0) {
        setExamInfo({
          exam: data[0].exam_attempts.exams,
          user: data[0].exam_attempts.users,
        });
      }
    };

    loadReview();
  }, []);

  if (!answers.length)
    return <p className="p-6 text-gray-500">Loading review...</p>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* --- Review Page Header --- */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Exam Review</h1>

        <p className="text-gray-600 mt-2">
          {examInfo?.exam?.exam_title} <br />
          <span className="text-gray-500">{examInfo?.user?.email}</span>
        </p>
      </div>

      {/* --- Question List --- */}
      {answers.map((ans: any, index: number) => {
        const question = ans.questions;

        const userOptions = ans.selected_options
          ? ans.selected_options.split(",")
          : [];

        const correctOptions = question.correct_options
          ? question.correct_options.split(",")
          : [];

        const isCorrect = ans.is_correct;

        return (
          <div
            key={ans.answer_id}
            className={`p-5 rounded-xl border ${
              isCorrect
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <div className="flex justify-between mb-3">
              <h2 className="text-xl font-semibold">
                Question {index + 1}
              </h2>

              <span
                className={`px-3 py-1 rounded-lg text-sm ${
                  isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {isCorrect ? "Correct" : "Incorrect"}
              </span>
            </div>

            {/* --- Existing QuestionCard for pretty UI --- */}
            <QuestionCard question={question} readonly highlight={userOptions} />

            {/* --- User Answer Block --- */}
            <div className="mt-4">
              <h3 className="font-semibold">Your Answer:</h3>
              <p className="mt-1">
                {userOptions.length
                  ? userOptions.map((o) => (
                      <span
                        key={o}
                        className={`px-2 py-1 rounded text-white mr-2 ${
