import { apiGet } from "@/lib/api";

export default async function ResultPage({ params }: any) {
  const result = await apiGet(`/api/exam-results/${params.attemptId}`);

  return (
    <section className="max-w-3xl mx-auto p-10 text-center">
      <h1 className="text-3xl font-bold">Your Result</h1>

      <div className="mt-6 p-6 bg-white rounded-lg shadow">
        <p>Total Score: {result.data.total_score}</p>
        <p>Achieved: {result.data.achieved_score}</p>
        <p>Percentage: {result.data.percentage}%</p>
        <p>Accuracy: {result.data.accuracy}%</p>
        <p>Correct: {result.data.correct_answers}</p>
        <p>Incorrect: {result.data.incorrect_answers}</p>
      </div>
    </section>
  );
}
