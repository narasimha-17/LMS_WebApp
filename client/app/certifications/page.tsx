import Link from "next/link";
import CertificationCard from "@/components/CertificationCard";
import { apiGet } from "@/lib/api";

export default async function Home() {
  let certs: any[] = [];

  try {
    const response = await apiGet("/api/certifications");
    certs = response.data;
  } catch (e) {
    console.error("Home load error:", e);
    certs = [];
  }

  return (
    <section className="py-12 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Prepare for Global Certifications
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Mock tests, progress tracking and performance analytics.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {certs.map((c) => (
          <CertificationCard
            key={c.id}
            id={String(c.id)}
            title={c.title}
            badge={c.badge}
            count={c.testsCount ?? 0}
            testNames={c.testNames ?? []}
            image={c.image}

            examId={c.exam_id}  // ⭐ send exam ID
            userId={1}          // temp user
          />
        ))}
      </div>
    </section>
  );
}
