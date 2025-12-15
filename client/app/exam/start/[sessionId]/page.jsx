import { apiGet, apiPost } from "@/lib/api";

export default async function StartExam({ params }) {
  const { sessionId } = params;

  // Get exam session details
  const session = await apiGet(`/api/exam-sessions/${sessionId}`);

  // Create attempt
  const attempt = await apiPost(`/api/exam-attempts`, {
    exam_session_id: Number(sessionId),
    user_id: 2 // TODO: replace when auth is added
  });

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Starting Exam...</h1>

      <a
        href={`/exam/${attempt.data.attempt_id}`}
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
      >
        Begin
      </a>
    </div>
  );
}
