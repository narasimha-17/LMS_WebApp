"use client";

interface Props {
  question: string;
  options: string[];
  selected?: number | null;
  onSelect: (option: number) => void;
}

export default function QuestionCard({
  question,
  options,
  selected,
  onSelect
}: Props) {
  return (
    <div className="border p-6 rounded-xl shadow-sm">
      <h2 className="font-semibold text-lg mb-4">{question}</h2>

      <div className="flex flex-col gap-3">
        {options.map((opt, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`text-left px-4 py-3 border rounded-lg transition 
              ${selected === index ? "bg-blue-600 text-white" : "hover:bg-gray-100"}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
