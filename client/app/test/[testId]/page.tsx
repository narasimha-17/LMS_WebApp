// client/app/test/[testId]/result/page.tsx
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ResultChart from "@/components/ResultChart";

export default function TestResultPage() {
  const params = useSearchParams();
  const score = Number(params.get("score") || 0);
  const correct = Number(params.get("correct") || 0);
  const wrong = Number(params.get("wrong") || 0);

  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold mb-4">Test Result</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="p-6 border rounded-lg">
          <div className="text-4xl font-extrabold">{score}</div>
          <div className="mt-2 text-gray-600">Final score</div>

          <div className="mt-6 space-y-2">
            <div>Correct: {correct}</div>
            <div>Wrong: {wrong}</div>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <ResultChart correct={correct} wrong={wrong} />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/certifications" className="px-4 py-2 border rounded">Back to Certifications</Link>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">Home</Link>
      </div>
    </section>
  );
}
