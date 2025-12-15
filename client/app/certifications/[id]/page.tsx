import { apiGet } from "@/lib/api";
import StartExamButton from "./StartExamButton"; // ✅ ADDED
import StartTestButton from "./StartTestButton";


export default async function Page(props: any) {
  const { id } = await props.params;

  let response;

  try {
    response = await apiGet(`/api/certifications/${id}`);
  } catch (err) {
    console.error("❌ Error loading cert:", err);
    return (
      <div className="p-10 text-center text-red-600 text-xl font-semibold">
        Failed to load certification details.
      </div>
    );
  }

  const cert = response.data;

  // Try to parse JSON description
  let parsed: any = null;
  try {
    parsed = JSON.parse(cert.certification_description);
  } catch (e) {}

  return (
    <section className="max-w-5xl mx-auto py-12 px-6">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 text-center">
        {cert.certification_name}
      </h1>

      {/* Logo Image */}
      <div className="flex justify-center mt-6">
        <img
          src={cert.certification_image_path}
          alt="Certification"
          className="w-48 drop-shadow-md rounded-lg"
        />
      </div>

      {/* Description Section */}
      <div className="mt-10 p-6 rounded-xl bg-white shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Certification Overview
        </h2>

        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {parsed?.overview || cert.certification_description}
        </p>
      </div>

      {/* ------------------------------------------------ */}
      {/* ACCORDION SECTION (unchanged) */}
      {/* ------------------------------------------------ */}
      <div className="mt-8 space-y-4">
        {parsed?.exam_details && (
          <Accordion title="📝 Exam Details">
            <ul className="space-y-2 text-gray-700">
              {Object.entries(parsed.exam_details).map(([key, value]) => (
                <li key={key} className="flex justify-between border-b pb-1">
                  <span className="font-semibold capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span>
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </span>
                </li>
              ))}
            </ul>
          </Accordion>
        )}

        {parsed?.who_should_take && (
          <Accordion title="🎯 Who Should Take This Certification?">
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              {parsed.who_should_take.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </Accordion>
        )}
      </div>

      {/* Details Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-700">
            Certification Level
          </h3>
          <p className="mt-2 text-gray-800 font-medium">
            {cert.certification_level || "N/A"}
          </p>
        </div>

        <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md border border-green-200">
          <h3 className="text-lg font-semibold text-green-700">
            Certification Code
          </h3>
          <p className="mt-2 text-gray-800 font-medium">
            {cert.certification_code || "Not Provided"}
          </p>
        </div>
      </div>

      {/* ⭐ START EXAM BUTTON HERE ⭐ */}
     <div className="flex justify-center mt-12">
  <StartTestButton />
</div>
    </section>
  );
}

/* ------------------------------------------
   Simple Tailwind Accordion Component
------------------------------------------- */
function Accordion({ title, children }: any) {
  return (
    <details className="border rounded-xl bg-white shadow-sm">
      <summary className="cursor-pointer px-4 py-3 text-lg font-semibold bg-gray-100 hover:bg-gray-200 rounded-t-xl">
        {title}
      </summary>
      <div className="px-4 py-4 border-t text-gray-700">{children}</div>
    </details>
  );
}
