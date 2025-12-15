"use client";

export default function SubmitPage({ params }: any) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Submitting...</h1>
      {(() => {
        window.location.href = `/exam/results/${params.attemptId}`;
      })()}
    </div>
  );
}
