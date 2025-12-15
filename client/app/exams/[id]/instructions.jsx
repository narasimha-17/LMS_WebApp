"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Button from "@/components/Button";

export default function ExamInstructions({ params }: any) {
  const [exam, setExam] = useState<any>(null);

  useEffect(() => {
    api.get(`/exams/${params.id}`).then((res) => setExam(res.data.data));
  }, []);

  const startSession = async () => {
    const res = await api.post("/exam-sessions", {
      exam_id: exam.exam_id,
      user_id: 2,
    });

    const sessionId = res.data.data.id;
    window.location.href = `/exam/start/${sessionId}`;
  };

  if (!exam) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{exam.exam_title}</h1>
      <p className="mt-3 text-gray-700">{exam.instructions}</p>

      <div className="mt-6">
        <Button onClick={startSession}>Start Exam</Button>
      </div>
    </div>
  );
}
