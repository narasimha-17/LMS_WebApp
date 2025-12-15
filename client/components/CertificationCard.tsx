import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  badge: string;
  count: number;
  image?: string;

  examId: number;   // ⭐ NEW
  userId: number;   // ⭐ NEW
};

export default function CertificationCard({
  id,
  title,
  badge,
  count,
  image,
  examId,
  userId
}: Props) {
  return (
    <div className="border rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition">

      {image && (
        <div className="w-full h-40 relative mb-4">
          <Image src={image} alt={title} fill className="object-contain" />
        </div>
      )}

      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{badge}</p>

      <Link
        href={`/certifications/${id}?examId=${examId}&userId=${userId}`}
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
}
